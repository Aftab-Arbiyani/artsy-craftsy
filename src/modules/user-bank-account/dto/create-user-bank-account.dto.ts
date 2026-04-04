import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserBankAccountDto {
  @IsString()
  @IsNotEmpty()
  account_holder_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 18, { message: 'Account number must be between 9 and 18 digits' })
  @Matches(/^\d+$/, { message: 'Account number must contain only digits' })
  account_number: string;

  @IsString()
  @IsNotEmpty()
  ifsc_code: string;

  @IsString()
  @IsOptional()
  @IsIn(['savings', 'current'], {
    message: 'Account type must be savings or current',
  })
  account_type?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  // Injected by controller
  user?: string;
  email?: string;
}
