import { RepositoryPort } from '@app/common/ports/repository.port';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';

export interface WorkspaceRepositoryPort
  extends RepositoryPort<WorkspaceEntity> {}
