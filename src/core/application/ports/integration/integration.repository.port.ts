import { RepositoryPort } from '@app/common/ports/repository.port';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';

export interface IntegrationRepositoryPort
  extends RepositoryPort<IntegrationEntity> {}
