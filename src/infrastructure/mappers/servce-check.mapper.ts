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
      ownerId: copy.ownerId,
      name: copy.name,
      url: copy.url,
      interval: copy.interval,
      timeout: copy.timeout,
      alertCheckThreshold: copy.alertCheckThreshold,
      method: copy.method,
      body: copy.body,
      headers: JSON.stringify(copy.headers),
      status: copy.status,
      type: copy.type,
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
        ownerId: record.ownerId,
        name: record.name,
        url: record.url,
        interval: record.interval,
        timeout: record.timeout,
        alertCheckThreshold: record.alertCheckThreshold,
        method: record.method,
        body: record.body,
        headers: JSON.parse(record.headers),
        status: record.status,
        type: record.type,
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
    response.ownerId = props.ownerId;
    response.name = props.name;
    response.url = props.url;
    response.interval = props.interval;
    response.timeout = props.timeout;
    response.alertCheckThreshold = props.alertCheckThreshold;
    response.method = props.method;
    response.body = props.body;
    response.headers = props.headers;
    response.status = props.status;
    response.type = props.type;
    return response;
  }
}
