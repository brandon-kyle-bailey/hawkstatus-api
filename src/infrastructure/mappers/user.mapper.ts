import { Mapper } from '@app/common/ddd/mapper.base';
import { Injectable } from '@nestjs/common';
import { UserRepositoryEntity } from 'src/core/application/ports/user/user.entity';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserResponseDto } from 'src/interface/dtos/user/user.response.dto';

@Injectable()
export class UserMapper
  implements Mapper<UserEntity, UserRepositoryEntity, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserRepositoryEntity {
    return UserMapper.toPersistence(entity);
  }
  static toPersistence(entity: UserEntity): UserRepositoryEntity {
    const copy = entity.getProps();
    const record: UserRepositoryEntity = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      deletedAt: copy.deletedAt,
      name: copy.name,
      email: copy.email,
      phone: copy.phone,
      verified: copy.verified,
      password: copy.password,
    };
    return record;
  }

  toDomain(record: UserRepositoryEntity): UserEntity {
    return UserMapper.toDomain(record);
  }
  static toDomain(record: UserRepositoryEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      props: {
        name: record.name,
        email: record.email,
        phone: record.phone,
        password: record.password,
        verified: record.verified,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    return UserMapper.toResponse(entity);
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto(entity);
    if (props.token) {
      const { access_token, refresh_token } = props.token.unpack();
      response.access_token = access_token;
      response.refresh_token = refresh_token;
    }
    response.name = props.name;
    response.email = props.email;
    response.phone = props.phone;
    return response;
  }
}
