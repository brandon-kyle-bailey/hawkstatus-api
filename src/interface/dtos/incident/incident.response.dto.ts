import { ResponseBase } from '@app/common/dto/response.base';

export class IncidentResponseDto extends ResponseBase {
  serviceCheckId: string;
  status: string;
}
