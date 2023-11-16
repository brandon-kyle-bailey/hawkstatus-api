import { RepositoryPort } from '@app/common/ports/repository.port';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';

export interface IncidentRepositoryPort
  extends RepositoryPort<IncidentEntity> {}
