import { RepositoryPort } from '@app/common/ports/repository.port';
import { ServiceCheckEntity } from 'src/core/domain/entities/service-check.entity';

export interface ServiceCheckRepositoryPort
  extends RepositoryPort<ServiceCheckEntity> {}
