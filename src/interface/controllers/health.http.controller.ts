import { Controller, Get, Logger, Query, Req } from '@nestjs/common';

@Controller('v1')
export class HealthController {
  constructor(protected readonly logger: Logger) {}

  @Get('health')
  async health(
    @Query() query: any,
    @Req() request: any,
  ): Promise<{ [key: string]: string }> {
    try {
      return {
        status: 'alive',
      };
    } catch (error) {
      this.logger.error('HealthController.health encountered an error', error);
    }
  }
}
