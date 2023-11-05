import { AggregateID } from '@app/common/ddd/entity.base';

export class VerifyEmailRequestDto {
  readonly userId: AggregateID;
  readonly name: string;
  readonly email: string;
}
