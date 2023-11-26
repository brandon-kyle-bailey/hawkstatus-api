import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { ServiceCheckMapper } from 'src/infrastructure/mappers/servce-check.mapper';
import { CreateServiceCheckCommand } from 'src/interface/commands/service-check/create-service-check.command';
import { CreateServiceCheckRequestDto } from 'src/interface/dtos/service-check/create-service-check.request.dto';
import { ServiceCheckResponseDto } from 'src/interface/dtos/service-check/service-check.response.dto';

@Controller('v1')
export class CreateServiceCheckController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: ServiceCheckMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('service-check')
  async create(
    @Body() body: CreateServiceCheckRequestDto,
    @Req() request: any,
  ): Promise<ServiceCheckResponseDto> {
    try {
      const command = CreateServiceCheckCommand.create({
        ...body,
        ownerId: request.user.sub,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'CreateServiceCheckController.create encountered an error',
        error,
      );
    }
  }
}
