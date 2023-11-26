import { ResponseBase } from '@app/common/dto/response.base';

export class ServiceCheckResponseDto extends ResponseBase {
  ownerId: string;
  name: string;
  url: string;
  interval: number;
  timeout: number;
  alertCheckThreshold: number;
  method: string;
  body: string;
  headers: { [key: string]: any };
  status: string;
  type: string;
}
