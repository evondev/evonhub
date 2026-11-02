import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { record } from "./trace.js";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    record("exception filter");

    const response = host.switchToHttp().getResponse();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
    });
  }
}
