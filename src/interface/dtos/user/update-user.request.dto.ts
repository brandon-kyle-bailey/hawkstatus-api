export class UpdateUserRequestDto {
  readonly userId: string;
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly password?: string;
  readonly verified?: boolean;
}
