import { Body, Controller, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IntegrationMapper } from 'src/infrastructure/mappers/integration.mapper';
import { UpdateIntegrationCommand } from 'src/interface/commands/integration/update-integration.command';
import { IntegrationResponseDto } from 'src/interface/dtos/integration/integration.response.dto';
import { UpdateIntegrationRequestDto } from 'src/interface/dtos/integration/update-integration.request.dto';

@Controller('v1')
export class UpdateIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: IntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Put('integration')
  async update(
    @Body() body: UpdateIntegrationRequestDto,
    @Req() request: any,
  ): Promise<IntegrationResponseDto> {
    try {
      const command = UpdateIntegrationCommand.create(body);
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'UpdateIntegrationController.update encountered an error',
        error,
      );
    }
  }
}
