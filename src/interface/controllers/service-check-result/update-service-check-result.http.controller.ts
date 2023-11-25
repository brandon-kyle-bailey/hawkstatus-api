import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckResultMapper } from 'src/infrastructure/mappers/service-check-result.mapper';
import { UpdateServiceCheckResultCommand } from 'src/interface/commands/service-check-result/update-service-check-result.command';
import { ServiceCheckResultResponseDto } from 'src/interface/dtos/service-check-result/service-check-result.response.dto';
import { UpdateServiceCheckResultRequestDto } from 'src/interface/dtos/service-check-result/update-service-check-result.request.dto';

@Controller('v1')
export class UpdateServiceCheckResultController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ServiceCheckResultMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('service-check-result')
  async update(
    @Body() body: UpdateServiceCheckResultRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResultResponseDto> {
    try {
      const command = UpdateServiceCheckResultCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateServiceCheckResultController.update encountered an error',
        error,
      );
    }
  }
}
