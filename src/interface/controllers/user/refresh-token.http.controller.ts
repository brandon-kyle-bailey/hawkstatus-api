import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserTokenResponseDto } from '../../dtos/user/user.response.dto';
import { RefreshUserTokenCommand } from '../../commands/user/refresh-user-token.command';
import { RefreshUserTokenRequestDto } from '../../dtos/user/refresh-user-token.request.dto';
import { UserTokenValueObject } from 'src/core/domain/value-objects/user-token.value-object';

@Controller('v1')
export class RefreshUserTokenController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @Post('user/refresh')
  async refresh(
    @Body() body: RefreshUserTokenRequestDto,
  ): Promise<UserTokenResponseDto> {
    try {
      const command = RefreshUserTokenCommand.create(body);
      const result: UserTokenValueObject =
        await this.commandBus.execute(command);
      const response = new UserTokenResponseDto();
      const token = result.unpack();
      response.access_token = token.access_token;
      response.refresh_token = token.refresh_token;
      return response;
    } catch (error) {
      this.logger.error(
        'RefreshUserTokenController.refresh encountered an error',
        error,
      );
    }
  }
}
