import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserTokenResponseDto } from '../../dtos/user/user.response.dto';
import { SigninUserRequestDto } from '../../dtos/user/signin-user.request.dto';
import { SigninUserCommand } from '../../commands/user/signin-user.command';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';

@Controller('v1')
export class SigninUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @Post('user/signin')
  async signin(
    @Body() body: SigninUserRequestDto,
  ): Promise<UserTokenResponseDto> {
    try {
      const command = SigninUserCommand.create(body);
      const result: UserTokenValueObject =
        await this.commandBus.execute(command);
      const response = new UserTokenResponseDto();
      const token = result.unpack();
      response.access_token = token.access_token;
      response.refresh_token = token.refresh_token;
      return response;
    } catch (error) {
      this.logger.error(
        'SigninUserController.create encountered an error',
        error,
      );
    }
  }
}
