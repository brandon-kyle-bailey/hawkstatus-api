import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IntegrationMapper } from 'src/infrastructure/mappers/integration.mapper';
import { CreateIntegrationCommand } from 'src/interface/commands/integration/create-integration.command';
import { CreateIntegrationRequestDto } from 'src/interface/dtos/integration/create-integration.request.dto';
import { IntegrationResponseDto } from 'src/interface/dtos/integration/integration.response.dto';

@Controller('v1')
export class CreateIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: IntegrationMapper,
  ) {}

  @Post('integration')
  async create(
    @Body() body: CreateIntegrationRequestDto,
  ): Promise<IntegrationResponseDto> {
    try {
      const command = CreateIntegrationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateIntegrationController.create encountered an error',
        error,
      );
    }
  }
}
