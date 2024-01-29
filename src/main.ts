import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionExceptionFilter } from './exception/mongoose-exception.exception/mongoose-exception.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MongooseExceptionExceptionFilter());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      //   transform: true,
      //   transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(3000);
}
bootstrap();
