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

export const SWAGGER_CDN_OPTIONS = {
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
  ],
  swaggerOptions: {
    defaultModelsExpandDepth: 1,
    docExpansion: 'list',
    persistAuthorization: true,
  },
};
