import { SetMetadata } from '@nestjs/common';

export const TRANSLATE_KEY = 'translate_key';
export const Translate = (key: string) => SetMetadata(TRANSLATE_KEY, key);
