import { Admin } from '@/modules/admin/entities/admin.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Request } from 'express';

export interface mailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | Array<string>;
  bcc?: string | Array<string>;
  attachments?: {
    filename?: string | false | undefined;
    content?: string | Buffer | undefined;
    path?: string | undefined;
    folder?: string; // ! Create Enum for folder
    contentType?: string | undefined;
  }[];
}

export type CreateUserToken = {
  user_id?: string;
  jwt: string;
  device_id: string;
  device_name: string;
  device_type: string;
  table_id: string;
  table: string;
};

export interface IRequest extends Request {
  user: User | Admin;
}

export type OrderBy = {
  [key: string]: 'ASC' | 'DESC';
};
