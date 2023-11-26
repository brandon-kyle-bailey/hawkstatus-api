import { RepositoryPort } from '@app/common/ports/repository.port';
import {
  ScheduleStatus,
  ServiceCheckEntity,
} from 'src/core/domain/entities/service-check.entity';

export interface ServiceCheckRepositoryPort
  extends RepositoryPort<ServiceCheckEntity> {
  findAllByStatus(status: ScheduleStatus): Promise<ServiceCheckEntity[]>;
}
