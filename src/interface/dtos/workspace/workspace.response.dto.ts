import { ResponseBase } from '@app/common/dto/response.base';

export class WorkspaceResponseDto extends ResponseBase {
  ownerId: string;
  name: string;
}
