import { ValueObject } from '@app/common/ddd/value-object.base';

export interface UserTokenPayloadProps {
  sub: string;
  username: string;
  email: string;
}

export class UserTokenPayloadValueObject extends ValueObject<UserTokenPayloadProps> {
  protected validate(props: UserTokenPayloadProps): void {}
}
