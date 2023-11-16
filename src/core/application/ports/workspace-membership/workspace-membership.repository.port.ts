import { RepositoryPort } from '@app/common/ports/repository.port';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';

export interface WorkspaceMembershipRepositoryPort
  extends RepositoryPort<WorkspaceMembershipEntity> {}
