import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`App listening on http://localhost:${PORT}`);
}
bootstrap();
