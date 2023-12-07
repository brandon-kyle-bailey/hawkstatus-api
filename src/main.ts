import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import configuration from '@app/common/config/configuration';
import { PickupServiceCheckCliController } from './interface/controllers/service-check/pickup-service-check.cli.controller';

const {
  web: { port },
} = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const logger = new Logger();
  const pickupServiceCheckCliController =
    app.get<PickupServiceCheckCliController>(PickupServiceCheckCliController);
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  await pickupServiceCheckCliController.pickup();
  logger.log(`🚀 Server ready at ${appUrl}`);
}
bootstrap();
