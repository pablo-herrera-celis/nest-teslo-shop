import { join } from 'path';
import { existsSync } from 'fs';

import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) throw new BadRequestException('Image not found');

    return path;
  }
}
