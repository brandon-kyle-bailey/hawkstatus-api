export class CreateIntegrationRequestDto {
  readonly ownerId: string;
  readonly type: string;
  readonly url?: string;
}
