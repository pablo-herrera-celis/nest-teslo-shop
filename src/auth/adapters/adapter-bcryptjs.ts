import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';

export interface IAdapterBcrypt {
  hashSync(password: string): Promise<string>;
  compareSync(password: string, hash: string): Promise<boolean>;
}

@Injectable()
export class AdapterBcrypt implements IAdapterBcrypt {
  async hashSync(password: string) {
    return hashSync(password, 10);
  }

  async compareSync(password: string, hash: string) {
    return compareSync(password, hash);
  }
}
