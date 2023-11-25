import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IntegrationMapper } from 'src/infrastructure/mappers/integration.mapper';
import { IntegrationResponseDto } from 'src/interface/dtos/integration/integration.response.dto';
import { ListIntegrationRequestDto } from 'src/interface/dtos/integration/list-integration.request.dto';
import { ListIntegrationQuery } from 'src/interface/queries/integration/list-integration.query';

@Controller('v1')
export class ListIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: IntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('integration/list')
  async get(
    @Body() body: ListIntegrationRequestDto,
    @Req() request: any,
  ): Promise<IntegrationResponseDto> {
    try {
      const query = ListIntegrationQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'ListIntegrationController.get encountered an error',
        error,
      );
    }
  }
}
