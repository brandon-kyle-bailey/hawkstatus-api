import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { ServiceCheckResultRepositoryEntity } from 'src/core/application/ports/service-check-result/service-check-result.entity';
import { ServiceCheckResultEntity } from 'src/core/domain/entities/service-check-result.entity';
import { ServiceCheckResultResponseDto } from 'src/interface/dtos/service-check-result/service-check-result.response.dto';

@Injectable()
export class ServiceCheckResultMapper
  implements
    Mapper<
      ServiceCheckResultEntity,
      ServiceCheckResultRepositoryEntity,
      ServiceCheckResultResponseDto
    >
{
  toPersistence(
    entity: ServiceCheckResultEntity,
  ): ServiceCheckResultRepositoryEntity {
    return ServiceCheckResultMapper.toPersistence(entity);
  }
  static toPersistence(
    entity: ServiceCheckResultEntity,
  ): ServiceCheckResultRepositoryEntity {
    const copy = entity.getProps();
    const record: ServiceCheckResultRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(
    record: ServiceCheckResultRepositoryEntity,
  ): ServiceCheckResultEntity {
    return ServiceCheckResultMapper.toDomain(record);
  }
  static toDomain(
    record: ServiceCheckResultRepositoryEntity,
  ): ServiceCheckResultEntity {
    const entity = new ServiceCheckResultEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        serviceCheckId: '',
        status: 0,
        duration: 0,
        response: '',
      },
    });
    return entity;
  }

  toResponse(entity: ServiceCheckResultEntity): ServiceCheckResultResponseDto {
    return ServiceCheckResultMapper.toResponse(entity);
  }

  static toResponse(
    entity: ServiceCheckResultEntity,
  ): ServiceCheckResultResponseDto {
    const props = entity.getProps();
    const response = new ServiceCheckResultResponseDto(entity);
    return response;
  }
}
