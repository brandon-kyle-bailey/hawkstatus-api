import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { IncidentRepositoryEntity } from 'src/core/application/ports/incident/incident.entity';
import { IncidentEntity } from 'src/core/domain/entities/incident.entity';
import { IncidentResponseDto } from 'src/interface/dtos/incident/incident.response.dto';

@Injectable()
export class IncidentMapper
  implements
    Mapper<IncidentEntity, IncidentRepositoryEntity, IncidentResponseDto>
{
  toPersistence(entity: IncidentEntity): IncidentRepositoryEntity {
    return IncidentMapper.toPersistence(entity);
  }
  static toPersistence(entity: IncidentEntity): IncidentRepositoryEntity {
    const copy = entity.getProps();
    const record: IncidentRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(record: IncidentRepositoryEntity): IncidentEntity {
    return IncidentMapper.toDomain(record);
  }
  static toDomain(record: IncidentRepositoryEntity): IncidentEntity {
    const entity = new IncidentEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        serviceCheckId: '',
        status: '',
      },
    });
    return entity;
  }

  toResponse(entity: IncidentEntity): IncidentResponseDto {
    return IncidentMapper.toResponse(entity);
  }

  static toResponse(entity: IncidentEntity): IncidentResponseDto {
    const props = entity.getProps();
    const response = new IncidentResponseDto(entity);
    return response;
  }
}
