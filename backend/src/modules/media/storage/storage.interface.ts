export interface UploadedFileDto {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFileResult {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface IStorageProvider {
  saveFile(file: UploadedFileDto, folder?: string): Promise<UploadedFileResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
