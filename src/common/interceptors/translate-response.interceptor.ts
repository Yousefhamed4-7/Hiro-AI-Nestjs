import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';
import { TRANSLATE_KEY } from '../decorators/translate.decorator';
import { Request, Response } from 'express';

@Injectable()
export class TranslateResponseInterceptor implements NestInterceptor {
  private translations: Record<string, Record<string, string>> = {};

  constructor(private reflector: Reflector) {
    try {
      const filePath = path.resolve(
        process.cwd(),
        'src',
        'i18n',
        'translations.json',
      );
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.translations = JSON.parse(fileContent);
    } catch (e) {
      Logger.log('Translation File Not found');
      this.translations = {};
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Read the metadata key from the decorator
    const translationKey = this.reflector.get<string>(
      TRANSLATE_KEY,
      context.getHandler(),
    );

    Logger.log('Interceptor Ran');

    return next.handle().pipe(
      map((data) => {
        if (!translationKey) return data;

        const request: Request = context.switchToHttp().getRequest();
        const clientLang = request.headers['accept-language'] || 'en';
        const lang = clientLang == 'ar' ? 'ar' : 'en';

        const translatedMessage = this.translations[translationKey]?.[lang];

        if (translatedMessage) {
          data.message = translatedMessage;
        }

        return data;
      }),
    );
  }
}
