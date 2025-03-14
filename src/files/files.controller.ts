import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/products',
        filename: (req, file, callback) => {
          const filename = `${uuid()}.${file.originalname.split('.').pop()}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
