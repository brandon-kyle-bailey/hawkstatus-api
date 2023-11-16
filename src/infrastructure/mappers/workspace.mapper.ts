import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';

@Injectable()
export class WorkspaceMapper
  implements
    Mapper<WorkspaceEntity, WorkspaceRepositoryEntity, WorkspaceResponseDto>
{
  toPersistence(entity: WorkspaceEntity): WorkspaceRepositoryEntity {
    return WorkspaceMapper.toPersistence(entity);
  }
  static toPersistence(entity: WorkspaceEntity): WorkspaceRepositoryEntity {
    const copy = entity.getProps();
    const record: WorkspaceRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(record: WorkspaceRepositoryEntity): WorkspaceEntity {
    return WorkspaceMapper.toDomain(record);
  }
  static toDomain(record: WorkspaceRepositoryEntity): WorkspaceEntity {
    const entity = new WorkspaceEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {},
    });
    return entity;
  }

  toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    return WorkspaceMapper.toResponse(entity);
  }

  static toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceResponseDto(entity);
    return response;
  }
}
