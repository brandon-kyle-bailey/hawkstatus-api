import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/core/application/services/auth/auth.guard';
import { WorkspaceMapper } from 'src/infrastructure/mappers/workspace.mapper';
import { ListWorkspaceRequestDto } from 'src/interface/dtos/workspace/list-workspace.request.dto';
import { WorkspaceResponseDto } from 'src/interface/dtos/workspace/workspace.response.dto';
import { ListWorkspaceQuery } from 'src/interface/queries/workspace/list-workspace.query';

@Controller('v1')
export class ListWorkspaceController {
  constructor(
    protected readonly logger: Logger,
    protected readonly queryBus: QueryBus,
    protected readonly mapper: WorkspaceMapper,
  ) {}

  @UseGuards(AuthGuard)
  @Get('workspace/list')
  async get(
    @Body() body: ListWorkspaceRequestDto,
    @Req() request: any,
  ): Promise<WorkspaceResponseDto> {
    try {
      const query = ListWorkspaceQuery.create({
        id: body.id,
      });
      const result = await this.queryBus.execute(query);
      const response = this.mapper.toResponse(result);
      return response;
    } catch (error) {
      this.logger.error(
        'ListWorkspaceController.get encountered an error',
        error,
      );
    }
  }
}
