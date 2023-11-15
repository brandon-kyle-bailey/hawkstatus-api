export class CreateUserRequestDto {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly password: string;
}
