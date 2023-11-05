import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { RequestContextModule } from 'nestjs-request-context';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '@app/common/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { UserRepositoryEntity } from './core/application/ports/user/user.entity';
import { UserRepository } from './core/application/ports/user/user.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { AuthGuard } from './core/application/services/auth/auth.guard';
import { CreateUserController } from './interface/controllers/user/create-user.http.controller';
import { DeleteUserController } from './interface/controllers/user/delete-user.http.controller';
import { GetUserController } from './interface/controllers/user/get-user.http.controller';
import { RefreshUserTokenController } from './interface/controllers/user/refresh-token.http.controller';
import { SigninUserController } from './interface/controllers/user/sign-in-user.http.controller';
import { UpdateUserController } from './interface/controllers/user/update-user.http.controller';
import { VerifyEmailEventController } from './interface/controllers/user/verify-email.event.controller';
import { VeriyUserController } from './interface/controllers/user/verify-user.http.controller';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserTokenService } from './core/application/services/auth/create-user-token.service';
import { RefreshUserTokenService } from './core/application/services/auth/refresh-user-token.service';
import { VerifyUserTokenService } from './core/application/services/auth/verify-user-token.service';
import { CreateUserService } from './core/application/services/user/create-user.service';
import { DeleteUserService } from './core/application/services/user/delete-user.service';
import { GetUserService } from './core/application/services/user/get-user.service';
import { SendVerificationEmailService } from './core/application/services/user/send-verification-email.service';
import { SigninUserService } from './core/application/services/user/signin-user.service';
import { UpdateUserService } from './core/application/services/user/update-user.service';
import { SmtpModule } from './infrastructure/adapters/smtp/smtp.module';
import { SendEmailService } from './core/application/services/notifications/send-email.service';

const {
  web: { secret, access_token_refresh },
} = configuration();

const entities = [UserRepositoryEntity];
const repositories = [UserRepository];
const mappers = [UserMapper];
const services = [
  CreateUserTokenService,
  VerifyUserTokenService,
  RefreshUserTokenService,

  SendVerificationEmailService,
  CreateUserService,
  UpdateUserService,
  GetUserService,
  DeleteUserService,
  SigninUserService,

  SendEmailService,
];
const guards = [AuthGuard];

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
  TypeOrmModule.forFeature(entities),
  EventEmitterModule.forRoot({ global: true }),
  JwtModule.register({
    global: true,
    secret: secret,
    signOptions: { expiresIn: access_token_refresh },
  }),
  RequestContextModule,
  CqrsModule,
  DatabaseModule,
  SmtpModule,
];
const controllers = [
  RefreshUserTokenController,
  VeriyUserController,
  VerifyEmailEventController,
  GetUserController,
  UpdateUserController,
  CreateUserController,
  DeleteUserController,
  SigninUserController,
];
const providers = [
  Logger,
  ConfigService,
  ...repositories,
  ...mappers,
  ...services,
  ...guards,
];

@Module({
  imports,
  controllers,
  providers,
})
export class AppModule {}
