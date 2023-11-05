import { Controller, Get, Logger, Query, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { VeriyUserRequestDto } from '../../dtos/user/verfiy-user.request.dto';
import { UpdateUserCommand } from '../../commands/user/update-user.command';
import { UpdateUserRequestDto } from '../../dtos/user/update-user.request.dto';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';

@Controller('v1')
export class VeriyUserController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: UserMapper,
  ) {}

  @Get('user/verify')
  async verify(
    @Query() query: VeriyUserRequestDto,
    @Req() request: any,
  ): Promise<void> {
    try {
      const command = UpdateUserCommand.create({
        userId: query.id,
        verified: true,
      } as UpdateUserRequestDto);
      const result = await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'VeriyUserController.verify encountered an error',
        error,
      );
    }
  }
}
