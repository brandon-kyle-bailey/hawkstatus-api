import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { IntegrationMapper } from 'src/infrastructure/mappers/integration.mapper';
import { GetIntegrationRequestDto } from 'src/interface/dtos/integration/get-integration.request.dto';
import { IntegrationResponseDto } from 'src/interface/dtos/integration/integration.response.dto';
import { GetIntegrationQuery } from 'src/interface/queries/integration/get-integration.query';

@Controller('v1')
export class GetIntegrationController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: IntegrationMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('integration')
  async get(
    @Body() body: GetIntegrationRequestDto,
    @Req() request: any,
  ): Promise<IntegrationResponseDto> {
    try {
      const query = GetIntegrationQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'GetIntegrationController.get encountered an error',
        error,
      );
    }
  }
}
