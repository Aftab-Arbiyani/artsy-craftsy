import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import 'dotenv/config';
import { CONSTANT } from '@/shared/constants/message';
import { Token } from '@/modules/token/entities/token.entity';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: {
      id: string;
      column: string;
      table: string;
    },
  ) {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      if (!token) {
        throw new UnauthorizedException(CONSTANT.ERROR.UNAUTHENTICATED);
      }

      // Validate the token from the database
      const storedToken = await this.tokenRepository.findOne({
        where: { jwt: token },
      });

      if (!storedToken) {
        throw new UnauthorizedException(CONSTANT.ERROR.UNAUTHENTICATED);
      }

      const entity = await this.userRepository.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!entity) {
        throw new UnauthorizedException(CONSTANT.ERROR.UNAUTHENTICATED);
      }

      Object.assign(entity, { role: payload.table });
      return entity;
    } catch (_error) {
      throw new UnauthorizedException(CONSTANT.ERROR.UNAUTHENTICATED);
    }
  }
}
