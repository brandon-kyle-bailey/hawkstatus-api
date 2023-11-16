import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { ServiceCheckRepositoryEntity } from 'src/core/application/ports/service-check/service-check.entity';
import { ServiceCheckEntity } from 'src/core/domain/entities/service-check.entity';
import { ServiceCheckResponseDto } from 'src/interface/dtos/service-check/service-check.response.dto';

@Injectable()
export class ServiceCheckMapper
  implements
    Mapper<
      ServiceCheckEntity,
      ServiceCheckRepositoryEntity,
      ServiceCheckResponseDto
    >
{
  toPersistence(entity: ServiceCheckEntity): ServiceCheckRepositoryEntity {
    return ServiceCheckMapper.toPersistence(entity);
  }
  static toPersistence(
    entity: ServiceCheckEntity,
  ): ServiceCheckRepositoryEntity {
    const copy = entity.getProps();
    const record: ServiceCheckRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(record: ServiceCheckRepositoryEntity): ServiceCheckEntity {
    return ServiceCheckMapper.toDomain(record);
  }
  static toDomain(record: ServiceCheckRepositoryEntity): ServiceCheckEntity {
    const entity = new ServiceCheckEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        ownerId: '',
        name: '',
        url: '',
        interval: 0,
        timeout: 0,
        alertCheckThreshold: 0,
        method: '',
        body: '',
        headers: [],
        status: '',
        type: '',
      },
    });
    return entity;
  }

  toResponse(entity: ServiceCheckEntity): ServiceCheckResponseDto {
    return ServiceCheckMapper.toResponse(entity);
  }

  static toResponse(entity: ServiceCheckEntity): ServiceCheckResponseDto {
    const props = entity.getProps();
    const response = new ServiceCheckResponseDto(entity);
    return response;
  }
}
