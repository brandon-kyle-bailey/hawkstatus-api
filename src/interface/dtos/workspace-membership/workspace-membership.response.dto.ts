import { ResponseBase } from '@app/common/dto/response.base';

export class WorkspaceMembershipResponseDto extends ResponseBase {
  workspaceId: string;
  userId: string;
}
