import { ValueObject } from '@app/common/ddd/value-object.base';

export interface UserTokenProps {
  access_token: string;
  refresh_token: string;
}

export class UserTokenValueObject extends ValueObject<UserTokenProps> {
  protected validate(props: UserTokenProps): void {}
}
