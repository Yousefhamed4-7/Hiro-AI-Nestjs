import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Hiro Ai Api')
  .setDescription('The Documentation for Hiro Ai API')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token',
    },
    'access-token', // This is the security scheme name
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your refresh JWT token',
    },
    'refresh-token',
  )
  .addGlobalParameters({
    name: 'Accept-Language',
    in: 'header',
    required: false,
    description: 'The preferred language for response messages (e.g., en, ar)',
    schema: {
      type: 'string',
      default: 'en',
      enum: ['en', 'ar'], // Shows a dropdown list in the Swagger UI
    },
  });
