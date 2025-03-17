import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';

export interface IAdapterBcrypt {
  hashSync(password: string): string;
  compareSync(password: string, hash: string): boolean;
}

@Injectable()
export class AdapterBcrypt implements IAdapterBcrypt {
  hashSync(password: string) {
    return hashSync(password, 10);
  }

  compareSync(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
