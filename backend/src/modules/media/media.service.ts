import { Injectable, BadRequestException } from '@nestjs/common';
import { LocalStorageProvider } from './storage/local-storage.provider';
import { UploadedFileResult, UploadedFileDto } from './storage/storage.interface';

@Injectable()
export class MediaService {
  constructor(private readonly storageProvider: LocalStorageProvider) {}

  async uploadImage(file: UploadedFileDto, folder: string = 'avatars'): Promise<UploadedFileResult> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and GIF are permitted.');
    }

    // Maximum 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }

    return this.storageProvider.saveFile(file, folder);
  }

  async deleteImage(url: string): Promise<boolean> {
    return this.storageProvider.deleteFile(url);
  }
}
