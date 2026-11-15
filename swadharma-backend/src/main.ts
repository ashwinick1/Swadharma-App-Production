
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { join } from 'path';
import 'pg';

async function createApp() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.init();

  return { app, server };
}

// Local development
if (!process.env.VERCEL) {
  async function bootstrap() {
    const { app } = await createApp();
    await app.listen(process.env.PORT || 3000);
  }

  bootstrap();
}

// Vercel serverless handler
let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  appPromise ??= createApp();

  const { server } = await appPromise;

  return server(req, res);
}
