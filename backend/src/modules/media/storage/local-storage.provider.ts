import { Injectable } from '@nestjs/common';
import { IStorageProvider, UploadedFileResult, UploadedFileDto } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: UploadedFileDto, folder: string = 'avatars'): Promise<UploadedFileResult> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(targetFolder, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${folder}/${filename}`;

    return {
      url,
      filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const urlParts = fileUrl.split('/uploads/');
      if (urlParts.length > 1) {
        const relativePath = urlParts[1];
        const fullPath = path.join(this.uploadDir, relativePath);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not delete local file', e);
    }
    return false;
  }
}
