import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { WorkspaceRepositoryEntity } from 'src/core/application/ports/workspace/workspace.entity';
import { WorkspaceEntity } from 'src/core/domain/entities/workspace.entity';
import { WorkspaceResponseDto } from 'src/interface/dtos/workspace/workspace.response.dto';

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
      ownerId: copy.ownerId,
      name: copy.name,
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
      props: {
        ownerId: record.ownerId,
        name: record.name,
      },
    });
    return entity;
  }

  toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    return WorkspaceMapper.toResponse(entity);
  }

  static toResponse(entity: WorkspaceEntity): WorkspaceResponseDto {
    const props = entity.getProps();
    const response = new WorkspaceResponseDto(entity);
    response.name = props.name;
    response.ownerId = props.ownerId;
    return response;
  }
}
