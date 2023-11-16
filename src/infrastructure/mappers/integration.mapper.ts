import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { IntegrationRepositoryEntity } from 'src/core/application/ports/integration/integration.entity';
import { IntegrationEntity } from 'src/core/domain/entities/integration.entity';
import { IntegrationResponseDto } from 'src/interface/dtos/integration/integration.response.dto';

@Injectable()
export class IntegrationMapper
  implements
    Mapper<
      IntegrationEntity,
      IntegrationRepositoryEntity,
      IntegrationResponseDto
    >
{
  toPersistence(entity: IntegrationEntity): IntegrationRepositoryEntity {
    return IntegrationMapper.toPersistence(entity);
  }
  static toPersistence(entity: IntegrationEntity): IntegrationRepositoryEntity {
    const copy = entity.getProps();
    const record: IntegrationRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
    };
    return record;
  }

  toDomain(record: IntegrationRepositoryEntity): IntegrationEntity {
    return IntegrationMapper.toDomain(record);
  }
  static toDomain(record: IntegrationRepositoryEntity): IntegrationEntity {
    const entity = new IntegrationEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        ownerId: '',
        type: '',
      },
    });
    return entity;
  }

  toResponse(entity: IntegrationEntity): IntegrationResponseDto {
    return IntegrationMapper.toResponse(entity);
  }

  static toResponse(entity: IntegrationEntity): IntegrationResponseDto {
    const props = entity.getProps();
    const response = new IntegrationResponseDto(entity);
    return response;
  }
}
