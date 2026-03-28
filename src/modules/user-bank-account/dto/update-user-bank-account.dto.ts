import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserBankAccountDto {
  @IsBoolean()
  @IsNotEmpty()
  is_default: boolean;
}
