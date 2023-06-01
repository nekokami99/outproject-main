import { SetMetadata } from '@nestjs/common';

export const Auth = (secured: boolean) =>
  SetMetadata('OUTPROJECT_AUTH', secured);
