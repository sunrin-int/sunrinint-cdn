import { Injectable } from '@nestjs/common';
import { UploadFile } from './dto/UploadFile.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  upload(file: Express.Multer.File): UploadFile {
    return {
      location: `${this.configService.get('ORIGIN')}/${file.filename}`,
    };
  }
}
