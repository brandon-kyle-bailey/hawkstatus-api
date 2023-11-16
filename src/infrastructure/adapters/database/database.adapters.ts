import configuration from '@app/common/config/configuration';
import { IncidentRepositoryEntity } from 'src/core/application/ports/incident/incident.entity';
import { IntegrationRepositoryEntity } from 'src/core/application/ports/integration/integration.entity';
import { ServiceCheckResultRepositoryEntity } from 'src/core/application/ports/service-check-result/service-check-result.entity';
import { ServiceCheckRepositoryEntity } from 'src/core/application/ports/service-check/service-check.entity';
import { UserRepositoryEntity } from 'src/core/application/ports/user/user.entity';
import { WorkspaceMembershipRepositoryEntity } from 'src/core/application/ports/workspace-membership/workspace-membership.entity';
import { WorkspaceRepositoryEntity } from 'src/core/application/ports/workspace/workspace.entity';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const {
  database: {
    postgres: { driver, host, port, username, password, name: database },
  },
} = configuration();

export const databaseConfiguration: PostgresConnectionOptions = {
  nativeDriver: 'pg',
  host,
  port,
  username,
  password,
  database,
  entities: [
    UserRepositoryEntity,
    WorkspaceRepositoryEntity,
    WorkspaceMembershipRepositoryEntity,
    IntegrationRepositoryEntity,
    IncidentRepositoryEntity,
    ServiceCheckRepositoryEntity,
    ServiceCheckResultRepositoryEntity,
  ],
  migrations: [__dirname + '/./migrations/*'],
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  migrationsRun: process.env.NODE_ENV === 'development' ? false : true,
  type: 'postgres',
};

export const dataSource = new DataSource(
  databaseConfiguration as unknown as PostgresConnectionOptions,
);

export const adapters = [
  {
    provide: driver,
    useFactory: async () => dataSource,
  },
];
