import { ResponseBase } from '@app/common/dto/response.base';

export class ServiceCheckResultResponseDto extends ResponseBase {
  serviceCheckId: string;
  status: number;
  duration: number;
  response: string;
}
