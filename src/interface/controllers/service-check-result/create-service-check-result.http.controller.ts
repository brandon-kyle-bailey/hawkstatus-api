import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ServiceCheckResultMapper } from 'src/infrastructure/mappers/service-check-result.mapper';
import { CreateServiceCheckResultCommand } from 'src/interface/commands/service-check-result/create-service-check-result.command';
import { CreateServiceCheckResultRequestDto } from 'src/interface/dtos/service-check-result/create-service-check-result.request.dto';
import { ServiceCheckResultResponseDto } from 'src/interface/dtos/service-check-result/service-check-result.response.dto';

@Controller('v1')
export class CreateServiceCheckResultController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ServiceCheckResultMapper,
  ) {}

  @Post('service-check-result')
  async create(
    @Body() body: CreateServiceCheckResultRequestDto,
  ): Promise<ServiceCheckResultResponseDto> {
    try {
      const command = CreateServiceCheckResultCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateServiceCheckResultController.create encountered an error',
        error,
      );
    }
  }
}
