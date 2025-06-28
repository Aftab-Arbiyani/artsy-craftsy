import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONSTANT } from '../constants/message';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const status = data.status || HttpStatus.OK;

        // Set statusCode to 1 only if the status is a success status
        const statusCode = status >= 200 && status < 300 ? 1 : 0;

        // Customize the response format as needed
        const responseData = {
          status: statusCode,
          message: data.message || CONSTANT.SUCCESS.DEFAULT,
        };

        if (data?.limit !== undefined) {
          Object.assign(responseData, {
            total: data.total,
            limit: data.limit,
            offset: data.offset,
          });
        }

        Object.assign(responseData, {
          data: data.data,
        });
        response.status(status);
        return responseData;
      }),
    );
  }
}
