import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UserResponseDto,
  UserTokenResponseDto,
} from '../../dtos/user/user.response.dto';
import { SigninUserRequestDto } from '../../dtos/user/signin-user.request.dto';
import { SigninUserCommand } from '../../commands/user/signin-user.command';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { UserEntity } from 'src/core/domain/entities/user.entity';

@Controller('v1')
export class SigninUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Post('user/signin')
  async signin(@Body() body: SigninUserRequestDto): Promise<UserResponseDto> {
    try {
      const command = SigninUserCommand.create(body);
      const result: UserEntity = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'SigninUserController.signin encountered an error',
        error,
      );
    }
  }
}
