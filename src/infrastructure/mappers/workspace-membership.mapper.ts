import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { WorkspaceMembershipRepositoryEntity } from 'src/core/application/ports/workspace-membership/workspace-membership.entity';
import { WorkspaceMembershipEntity } from 'src/core/domain/entities/workspace-membership.entity';
import { WorkspaceMembershipResponseDto } from 'src/interface/dtos/workspace-membership/workspace-membership.response.dto';

@Injectable()
export class WorkspaceMembershipMapper
  implements
    Mapper<
      WorkspaceMembershipEntity,
      WorkspaceMembershipRepositoryEntity,
      WorkspaceMembershipResponseDto
    >
{
  toPersistence(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipRepositoryEntity {
    return WorkspaceMembershipMapper.toPersistence(entity);
  }
  static toPersistence(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipRepositoryEntity {
    const copy = entity.getProps();
    const record: WorkspaceMembershipRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(
    record: WorkspaceMembershipRepositoryEntity,
  ): WorkspaceMembershipEntity {
    return WorkspaceMembershipMapper.toDomain(record);
  }
  static toDomain(
    record: WorkspaceMembershipRepositoryEntity,
  ): WorkspaceMembershipEntity {
    const entity = new WorkspaceMembershipEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        workspaceId: '',
        userId: '',
      },
    });
    return entity;
  }

  toResponse(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipResponseDto {
    return WorkspaceMembershipMapper.toResponse(entity);
  }

  static toResponse(
    entity: WorkspaceMembershipEntity,
  ): WorkspaceMembershipResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceMembershipResponseDto(entity);
    return response;
  }
}
