import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserBankAccountService } from './user-bank-account.service';
import { CreateUserBankAccountDto } from './dto/create-user-bank-account.dto';
import { UpdateUserBankAccountDto } from './dto/update-user-bank-account.dto';
import { RazorPayService } from '../razor-pay/razor-pay.service';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { IRequest } from '@/shared/constants/types';

@Controller('user-bank-account')
export class UserBankAccountController {
  constructor(
    private readonly userBankAccountService: UserBankAccountService,
    private readonly razorPayService: RazorPayService,
  ) {}

  /**
   * List all bank accounts for the logged-in user.
   * Bank account details (name, IFSC, etc.) are fetched from Razorpay.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Req() req: IRequest) {
    try {
      const accounts = await this.userBankAccountService.findAll({
        where: { user: { id: req.user.id } },
        order: { created_at: 'DESC' },
      });

      // Enrich each record with details from Razorpay
      const enriched = await Promise.all(
        accounts.map(async (account) => {
          const fundAccount = await this.razorPayService.getFundAccount(
            account.razorpay_fund_account_id,
          );
          return {
            id: account.id,
            is_default: account.is_default,
            created_at: account.created_at,
            razorpay_fund_account_id: account.razorpay_fund_account_id,
            bank_account: fundAccount.bank_account,
          };
        }),
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Bank accounts'),
        data: enriched,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  /**
   * Save a bank account.
   * Bank details are sent to Razorpay — only the returned IDs are stored in DB.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createDto: CreateUserBankAccountDto,
    @Req() req: IRequest,
  ) {
    try {
      // Step 1: Create a Razorpay contact for the user
      const contact = await this.razorPayService.createContact({
        name: createDto.account_holder_name,
        email: req.user.email,
        type: 'employee',
      });

      // Step 2: Register bank account as a Razorpay fund account
      const fundAccount = await this.razorPayService.createFundAccount({
        contact_id: contact.id,
        account_type: 'bank_account',
        bank_account: {
          name: createDto.account_holder_name,
          ifsc: createDto.ifsc_code,
          account_number: createDto.account_number,
        },
      });

      // Step 3: Save only the Razorpay IDs in our DB
      const saved = await this.userBankAccountService.create(
        req.user.id,
        contact.id,
        fundAccount.id,
        createDto.is_default ?? false,
      );

      return response.successCreate({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Bank account'),
        data: {
          id: saved.id,
          is_default: saved.is_default,
          razorpay_fund_account_id: saved.razorpay_fund_account_id,
          bank_account: fundAccount.bank_account,
        },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  /**
   * Set a bank account as default.
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateDto: UpdateUserBankAccountDto,
    @Req() req: IRequest,
  ) {
    try {
      const account = await this.userBankAccountService.findOneWhere({
        where: { id, user: { id: req.user.id } },
      });

      if (!account) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Bank account'),
          data: {},
        });
      }

      if (updateDto.is_default) {
        await this.userBankAccountService.setDefault(id, req.user.id);
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Bank account'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  /**
   * Remove a bank account (soft delete).
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id', UUIDValidationPipe) id: string,
    @Req() req: IRequest,
  ) {
    try {
      const account = await this.userBankAccountService.findOneWhere({
        where: { id, user: { id: req.user.id } },
      });

      if (!account) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Bank account'),
          data: {},
        });
      }

      await this.userBankAccountService.delete(id);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Bank account'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
