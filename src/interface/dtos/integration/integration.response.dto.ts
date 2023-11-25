import { ResponseBase } from '@app/common/dto/response.base';

export class IntegrationResponseDto extends ResponseBase {
  ownerId: string;
  type: string;
  url?: string;
}
