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
import { HealthController } from './interface/controllers/health.http.controller';
import { IncidentRepositoryEntity } from './core/application/ports/incident/incident.entity';
import { IntegrationRepositoryEntity } from './core/application/ports/integration/integration.entity';
import { ServiceCheckResultRepositoryEntity } from './core/application/ports/service-check-result/service-check-result.entity';
import { ServiceCheckRepositoryEntity } from './core/application/ports/service-check/service-check.entity';
import { WorkspaceMembershipRepositoryEntity } from './core/application/ports/workspace-membership/workspace-membership.entity';
import { WorkspaceRepositoryEntity } from './core/application/ports/workspace/workspace.entity';
import { IncidentRepository } from './core/application/ports/incident/incident.repository';
import { IntegrationRepository } from './core/application/ports/integration/integration.repository';
import { ServiceCheckResultRepository } from './core/application/ports/service-check-result/service-check-result.repository';
import { ServiceCheckRepository } from './core/application/ports/service-check/service-check.repository';
import { WorkspaceMembershipRepository } from './core/application/ports/workspace-membership/workspace-membership.repository';
import { WorkspaceRepository } from './core/application/ports/workspace/workspace.repository';
import { IncidentMapper } from './infrastructure/mappers/incident.mapper';
import { IntegrationMapper } from './infrastructure/mappers/integration.mapper';
import { ServiceCheckMapper } from './infrastructure/mappers/servce-check.mapper';
import { ServiceCheckResultMapper } from './infrastructure/mappers/service-check-result.mapper';
import { WorkspaceMembershipMapper } from './infrastructure/mappers/workspace-membership.mapper';
import { WorkspaceMapper } from './infrastructure/mappers/workspace.mapper';
import { CreateIncidentController } from './interface/controllers/incident/create-incident.http.controller';
import { DeleteIncidentController } from './interface/controllers/incident/delete-incident.http.controller';
import { GetIncidentController } from './interface/controllers/incident/get-incident.http.controller';
import { ListIncidentController } from './interface/controllers/incident/list-incident.http.controller';
import { UpdateIncidentController } from './interface/controllers/incident/update-incident.http.controller';
import { CreateIntegrationController } from './interface/controllers/integration/create-integration.http.controller';
import { DeleteIntegrationController } from './interface/controllers/integration/delete-integration.http.controller';
import { GetIntegrationController } from './interface/controllers/integration/get-integration.http.controller';
import { ListIntegrationController } from './interface/controllers/integration/list-integration.http.controller';
import { UpdateIntegrationController } from './interface/controllers/integration/update-integration.http.controller';
import { CreateServiceCheckResultController } from './interface/controllers/service-check-result/create-service-check-result.http.controller';
import { DeleteServiceCheckResultController } from './interface/controllers/service-check-result/delete-service-check-result.http.controller';
import { GetServiceCheckResultController } from './interface/controllers/service-check-result/get-service-check-result.http.controller';
import { ListServiceCheckResultController } from './interface/controllers/service-check-result/list-service-check-result.http.controller';
import { UpdateServiceCheckResultController } from './interface/controllers/service-check-result/update-service-check-result.http.controller';
import { CreateServiceCheckController } from './interface/controllers/service-check/create-service-check.http.controller';
import { DeleteServiceCheckController } from './interface/controllers/service-check/delete-service-check.http.controller';
import { GetServiceCheckController } from './interface/controllers/service-check/get-service-check.http.controller';
import { ListServiceCheckController } from './interface/controllers/service-check/list-service-check.http.controller';
import { UpdateServiceCheckController } from './interface/controllers/service-check/update-service-check.http.controller';
import { CreateWorkspaceController } from './interface/controllers/workspace/create-workspace.http.controller';
import { DeleteWorkspaceController } from './interface/controllers/workspace/delete-workspace.http.controller';
import { GetWorkspaceController } from './interface/controllers/workspace/get-workspace.http.controller';
import { ListWorkspaceController } from './interface/controllers/workspace/list-workspace.http.controller';
import { UpdateWorkspaceController } from './interface/controllers/workspace/update-workspace.http.controller';
import { CreateIncidentService } from './core/application/services/incident/create-incident.service';
import { DeleteIncidentService } from './core/application/services/incident/delete-incident.service';
import { GetIncidentService } from './core/application/services/incident/get-incident.service';
import { UpdateIncidentService } from './core/application/services/incident/update-incident.service';
import { CreateIntegrationService } from './core/application/services/integration/create-integration.service';
import { DeleteIntegrationService } from './core/application/services/integration/delete-integration.service';
import { GetIntegrationService } from './core/application/services/integration/get-integration.service';
import { ListIntegrationService } from './core/application/services/integration/list-integration.service';
import { UpdateIntegrationService } from './core/application/services/integration/update-integration.service';
import { CreateServiceCheckResultService } from './core/application/services/service-check-result/create-service-check-result.service';
import { DeleteServiceCheckResultService } from './core/application/services/service-check-result/delete-service-check-result.service';
import { GetServiceCheckResultService } from './core/application/services/service-check-result/get-service-check-result.service';
import { ListServiceCheckResultService } from './core/application/services/service-check-result/list-service-check-result.service';
import { UpdateServiceCheckResultService } from './core/application/services/service-check-result/update-service-check-result.service';
import { CreateServiceCheckService } from './core/application/services/service-check/create-service-check.service';
import { DeleteServiceCheckService } from './core/application/services/service-check/delete-service-check.service';
import { GetServiceCheckService } from './core/application/services/service-check/get-service-check.service';
import { ListServiceCheckService } from './core/application/services/service-check/list-service-check.service';
import { UpdateServiceCheckService } from './core/application/services/service-check/update-service-check.service';
import { CreateWorkspaceMembershipService } from './core/application/services/workspace-membership/create-workspace-membership.service';
import { UpdateWorkspaceMembershipService } from './core/application/services/workspace-membership/update-workspace-membership.service';
import { CreateWorkspaceService } from './core/application/services/workspace/create-workspace.service';
import { DeleteWorkspaceService } from './core/application/services/workspace/delete-workspace.service';
import { GetWorkspaceService } from './core/application/services/workspace/get-workspace.service';
import { UpdateWorkspaceService } from './core/application/services/workspace/update-workspace.service';
import { DeleteWorkspaceMembershipService } from './core/application/services/workspace-membership/delete-workspace-membership.service';
import { GetWorkspaceMembershipService } from './core/application/services/workspace-membership/get-workspace-membership.service';
import { ListWorkspaceService } from './core/application/services/workspace/list-workspace.service';
import { ListWorkspaceMembershipService } from './core/application/services/workspace-membership/list-workspace-membership.service';
import { ListIncidentService } from './core/application/services/incident/list-incident.service';
import { ScheduleServiceCheckService } from './core/application/services/service-check/schedule-service-check.service';
import { SchedulerRegistry } from '@nestjs/schedule';

const {
  web: { secret, access_token_refresh },
} = configuration();

const entities = [
  UserRepositoryEntity,
  WorkspaceRepositoryEntity,
  WorkspaceMembershipRepositoryEntity,
  IntegrationRepositoryEntity,
  IncidentRepositoryEntity,
  ServiceCheckRepositoryEntity,
  ServiceCheckResultRepositoryEntity,
];
const repositories = [
  UserRepository,
  WorkspaceRepository,
  WorkspaceMembershipRepository,
  IntegrationRepository,
  IncidentRepository,
  ServiceCheckRepository,
  ServiceCheckResultRepository,
];
const mappers = [
  UserMapper,
  WorkspaceMapper,
  WorkspaceMembershipMapper,
  IntegrationMapper,
  IncidentMapper,
  ServiceCheckMapper,
  ServiceCheckResultMapper,
];
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

  CreateIncidentService,
  UpdateIncidentService,
  GetIncidentService,
  ListIncidentService,
  DeleteIncidentService,

  CreateIntegrationService,
  UpdateIntegrationService,
  GetIntegrationService,
  ListIntegrationService,
  DeleteIntegrationService,

  CreateWorkspaceService,
  UpdateWorkspaceService,
  GetWorkspaceService,
  ListWorkspaceService,
  DeleteWorkspaceService,

  CreateWorkspaceMembershipService,
  UpdateWorkspaceMembershipService,
  GetWorkspaceMembershipService,
  ListWorkspaceMembershipService,
  DeleteWorkspaceMembershipService,

  CreateServiceCheckService,
  UpdateServiceCheckService,
  GetServiceCheckService,
  ListServiceCheckService,
  DeleteServiceCheckService,

  ScheduleServiceCheckService,

  CreateServiceCheckResultService,
  UpdateServiceCheckResultService,
  GetServiceCheckResultService,
  ListServiceCheckResultService,
  DeleteServiceCheckResultService,
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
  HealthController,

  GetIncidentController,
  UpdateIncidentController,
  CreateIncidentController,
  DeleteIncidentController,
  ListIncidentController,

  GetIntegrationController,
  UpdateIntegrationController,
  CreateIntegrationController,
  DeleteIntegrationController,
  ListIntegrationController,

  GetWorkspaceController,
  UpdateWorkspaceController,
  CreateWorkspaceController,
  DeleteWorkspaceController,
  ListWorkspaceController,

  GetServiceCheckController,
  UpdateServiceCheckController,
  CreateServiceCheckController,
  DeleteServiceCheckController,
  ListServiceCheckController,

  GetServiceCheckResultController,
  UpdateServiceCheckResultController,
  CreateServiceCheckResultController,
  DeleteServiceCheckResultController,
  ListServiceCheckResultController,
];
const providers = [
  Logger,
  ConfigService,
  SchedulerRegistry,
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
