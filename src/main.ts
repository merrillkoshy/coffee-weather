import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Coffee + Weather')
    .setDescription('OpenWeatherMaps CoffeeAPI description')
    .setVersion('1.0')
    .addTag('cities')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const config = app.get<ConfigService>(ConfigService);
  await app.listen(process.env.PORT || config.get<number>('APP_PORT'));
}

bootstrap();
