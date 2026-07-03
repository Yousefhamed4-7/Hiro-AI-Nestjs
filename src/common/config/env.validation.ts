import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url('DATABASE_URL must be a valid connection string'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET cannot be empty'),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET cannot be empty'),
  JWT_REFRESH_EXPIRES_IN: z.string(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.log('Missing Environment Variables');
    console.error(JSON.stringify(z.treeifyError(result.error), null, 2));

    throw new Error('Environment validation failed.');
  }

  return result.data;
}
