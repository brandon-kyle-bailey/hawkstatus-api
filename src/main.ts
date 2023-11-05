import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from '@app/common/config/configuration';

const {
  web: { port },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
