import { Controller, Get, Logger, Query, Redirect } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { VeriyUserRequestDto } from '../../dtos/user/verfiy-user.request.dto';
import { UpdateUserCommand } from '../../commands/user/update-user.command';
import { UpdateUserRequestDto } from '../../dtos/user/update-user.request.dto';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import configuration from '@app/common/config/configuration';

@Controller('v1')
export class VeriyUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Get('user/verify')
  @Redirect('https://docs.nestjs.com', 302)
  async verify(@Query() query: VeriyUserRequestDto): Promise<{ url: string }> {
    try {
      const command = UpdateUserCommand.create({
        userId: query.id,
        verified: true,
      } as UpdateUserRequestDto);
      await this.commandBus.execute(command);
      const { client_url } = configuration().web;
      return { url: `${client_url}/signin` };
    } catch (error) {
      this.logger.error(
        'VeriyUserController.verify encountered an error',
        error,
      );
    }
  }
}
