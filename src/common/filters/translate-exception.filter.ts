import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch(HttpException)
export class TranslateExceptionFilter implements ExceptionFilter {
  private translations: Record<string, Record<string, string>> = {};

  constructor() {
    try {
      const filePath = path.join(
        process.cwd(),
        'src',
        'i18n',
        'translations.json',
      );
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.translations = JSON.parse(fileContent);
    } catch (e) {
      Logger.log('File not found');
      this.translations = {};
    }
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const clientLang = request.headers['accept-language'] || 'en';
    const lang = clientLang.startsWith('ar') ? 'ar' : 'en';

    const exceptionResponse: any = exception.getResponse();
    let originalMessage = '';

    Logger.log('Filter Ran');

    if (typeof exceptionResponse === 'string') {
      originalMessage = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      originalMessage = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;
    }

    let translatedMessage = this.translations[originalMessage]?.[lang];

    if (translatedMessage && exceptionResponse?.fields) {
      translatedMessage = translatedMessage.replace(
        '{fields}',
        exceptionResponse?.fields.join(' '),
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: translatedMessage || originalMessage,
      error: exceptionResponse.error || undefined,
    });
  }
}
