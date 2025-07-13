import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { EmailService } from '@/shared/helpers/send-mail';
import { renderFile } from 'ejs';
import { resolve } from 'path';
import { Otp } from '../otp/entities/otp.entity';
import { DEVICE_TYPE, OTP_TYPE } from '@/shared/constants/enum';
import generateOtp from '@/shared/helpers/generate-otp';
import { EncryptDecryptService } from '@/shared/helpers/encrypt-decrypt';
import { EmailLoginDto } from './dto/email-login.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import generateToken from '@/shared/helpers/generate-token';
import { CreateUserToken } from '@/shared/constants/types';
import { Token } from '../token/entities/token.entity';
import * as jwt from 'jsonwebtoken';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptDecryptService: EncryptDecryptService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findOneWhere(options: FindOneOptions<User>): Promise<User | null> {
    const data = await this.userRepository.findOne(options);
    return data;
  }

  async signup(userSignupDto: UserSignupDto): Promise<User> {
    userSignupDto.password = await bcrypt.hash(userSignupDto.password, 10);
    const user = await this.userRepository.save(userSignupDto);
    await this.sendSignupEmail(user);
    return plainToInstance(User, user);
  }

  async sendSignupEmail(user: User) {
    const emailService = new EmailService();
    const otp = await this.generateSignupOtp(user, OTP_TYPE.SIGNUP);
    const encryptedOtp = this.encryptDecryptService.encrypt(`${otp}`);
    const encryptedEmail = this.encryptDecryptService.encrypt(user.email);
    const ejsTemplate = await renderFile(
      resolve(
        __dirname,
        `../../../src/shared/ejs-templates/email-verification.ejs`,
      ),
      {
        name: user.name,
        minutes: 10,
        redirectUrl:
          process.env.REDIRECT_URL +
          '/auth/verify-email?id=' +
          `${encryptedEmail}-${encryptedOtp}`,
      },
    );

    await emailService.sendMail({
      to: user.email,
      subject: 'Welcome to Artsy Craftsy',
      html: ejsTemplate,
    });
  }

  async generateSignupOtp(user: User, type: OTP_TYPE) {
    let otp = await this.otpRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        type,
      },
    });

    // In case of first signup OTP is not created
    const otpValue = generateOtp();
    const expireAt = Math.floor((Date.now() + 600000) / 1000); // Add 10 minutes

    if (!otp) {
      // Store OTP to database
      otp = await this.otpRepository.save({
        user,
        type,
        email: user.email,
        otp: otpValue,
        expire_at: expireAt,
      });

      return otpValue;
    }
    // Update Old OTP
    await this.otpRepository.update(otp.id, {
      type,
      otp: otpValue,
      expire_at: expireAt,
    });

    return otpValue;
  }

  async verifyEmail(id: string): Promise<boolean> {
    const [encryptedEmail, encryptedOtp] = id.split('-');
    const email = this.encryptDecryptService.decrypt(encryptedEmail);
    const otpValue = this.encryptDecryptService.decrypt(encryptedOtp);

    const otp = await this.otpRepository.findOne({
      where: {
        email,
        otp: parseInt(otpValue, 10),
        type: OTP_TYPE.SIGNUP,
        is_verified: false,
      },
    });

    if (!otp) return false;

    await this.otpRepository.update(otp.id, { is_verified: true });
    await this.userRepository.update({ email }, { is_email_verified: true });

    return true;
  }

  async login(user: User, emailLoginDto: EmailLoginDto) {
    const { is_email_verified } = user;

    if (!is_email_verified) {
      await this.sendSignupEmail(user);

      return response.successCreate({
        message: CONSTANT.SUCCESS.COMPLETE_EMAIL_VERIFICATION,
        data: { is_email_verified },
      });
    }

    if (emailLoginDto.password && user.password) {
      const isSame = await bcrypt.compare(
        emailLoginDto.password,
        user.password,
      );

      if (!isSame) {
        return response.badRequest({
          message: CONSTANT.ERROR.WRONG_CREDENTIALS,
          data: {},
        });
      }

      return this.getLoginResponse(user, emailLoginDto);
    }

    return response.badRequest({
      message: CONSTANT.ERROR.WRONG_CREDENTIALS,
      data: {},
    });
  }

  async getLoginResponse(user: User, emailLoginDto: EmailLoginDto) {
    // generate jwt token
    const jwt = generateToken(user.id, 'user_id', 'user');

    // store token and other details of user
    const token = await this.createUserToken({
      user_id: user.id,
      jwt,
      device_id: emailLoginDto.device_id,
      device_name: emailLoginDto.device_name,
      device_type: emailLoginDto.device_type,
      table_id: 'user_id',
      table: 'user',
    });

    const existingUser = await this.findOneWhere({
      relations: {
        addresses: true,
      },
      where: {
        id: user.id,
      },
    });

    const productCount = await this.productRepository.count({
      where: { user: { id: existingUser.id } },
    });

    return response.successResponse({
      message: CONSTANT.SUCCESS.LOGIN,
      data: {
        ...plainToInstance(User, existingUser),
        is_profile_complete: !!existingUser.addresses.length,
        product_count: productCount,
        is_payment_setup_complete: true,
        jwt: token,
      },
    });
  }

  async createUserToken(payload: CreateUserToken): Promise<string> {
    const { jwt, device_id, device_name, device_type, table_id, table } =
      payload;

    const isExist = await this.tokenRepository.findOne({
      where: {
        [table]: { id: payload[table_id] },
        deleted_at: null,
        device_id,
      },
    });

    const updateToken = async (id: string, newJwt: string) => {
      await this.tokenRepository.save({
        id,
        jwt: newJwt,
        login_at: new Date().toISOString(),
      });
      return newJwt;
    };

    if (isExist) {
      const isExpired = this.isTokenExpired(isExist.jwt);
      return isExpired
        ? await updateToken(isExist.id, jwt)
        : await updateToken(isExist.id, isExist.jwt);
    }

    const token: Token = new Token();
    token[table] = { id: payload[table_id] } as User;
    token.jwt = jwt;
    token.device_id = device_id;
    token.device_name = device_name;
    token.device_type = device_type as DEVICE_TYPE;
    token.login_at = new Date().toISOString();

    const result = await this.tokenRepository.save(token);
    return result.jwt;
  }

  isTokenExpired(token: string) {
    try {
      const valid = jwt.verify(token, process.env.JWT_SECRET);
      if (valid) return false;

      return true;
    } catch (_err) {
      return true;
    }
  }
}
