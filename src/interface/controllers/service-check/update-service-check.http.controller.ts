import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckMapper } from 'src/infrastructure/mappers/servce-check.mapper';
import { UpdateServiceCheckCommand } from 'src/interface/commands/service-check/update-service-check.command';
import { ServiceCheckResponseDto } from 'src/interface/dtos/service-check/service-check.response.dto';
import { UpdateServiceCheckRequestDto } from 'src/interface/dtos/service-check/update-service-check.request.dto';

@Controller('v1')
export class UpdateServiceCheckController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ServiceCheckMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('service-check')
  async update(
    @Body() body: UpdateServiceCheckRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResponseDto> {
    try {
      const command = UpdateServiceCheckCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateServiceCheckController.update encountered an error',
        error,
      );
    }
  }
}
