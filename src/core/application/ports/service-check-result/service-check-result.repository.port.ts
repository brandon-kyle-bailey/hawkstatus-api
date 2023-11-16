import { RepositoryPort } from '@app/common/ports/repository.port';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';

export interface ServiceCheckResultRepositoryPort
  extends RepositoryPort<ServiceCheckResultEntity> {}
