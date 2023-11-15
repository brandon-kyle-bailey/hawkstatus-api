import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import configuration from '@app/common/config/configuration';

const {
  web: { port },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  logger.log(`🚀 Server ready at ${appUrl}`);
}
bootstrap();
