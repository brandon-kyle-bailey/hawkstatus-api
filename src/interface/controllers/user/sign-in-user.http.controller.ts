import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserResponseDto } from '../../dtos/user/user.response.dto';
import { SigninUserRequestDto } from '../../dtos/user/signin-user.request.dto';
import { SigninUserCommand } from '../../commands/user/signin-user.command';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

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
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'SigninUserController.create encountered an error',
        error,
      );
    }
  }
}
