import configuration from '@app/common/config/configuration';
import { UserRepositoryEntity } from 'src/core/application/ports/user/user.entity';
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
  entities: [UserRepositoryEntity],
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
