import { ResponseBase } from '@app/common/dto/response.base';

export class UserTokenResponseDto {
  access_token: string;
  refresh_token: string;
}

export class UserResponseDto extends ResponseBase {
  name: string;
  email: string;
  phone: string;
  access_token?: string;
  refresh_token?: string;
}
