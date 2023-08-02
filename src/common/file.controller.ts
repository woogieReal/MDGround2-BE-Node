import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { UploadedFile } from "express-fileupload";

import { File } from './file.model';
import { AWSFileUploader } from "../file/awsFileUploader";

@injectable()
export class FileController implements interfaces.Controller {
  constructor(
    @inject("AWSFileUploader") private readonly awsFileUploader: AWSFileUploader
  ) {}

  async handleUploadFilesToS3(request: Request, fieldName: string): Promise<string[]> {
    let response: string[] = [];

    let files: any = request.files;
    if (!files) return response;
    
    files = files[fieldName];
    const uploadFiles: UploadedFile[] = Array.isArray(files) ? [...files] : [files];
    if (uploadFiles.length === 0) return response;

    const mappedFiles: File[] = uploadFiles.map((file: UploadedFile) => ({
        name: `${Date.now()}-${file.name}`,
        type: file.mimetype,
        content: file.data,
        size: file.size,
        extension: `${file.name.split(".").pop()}`,
    }));

    if (mappedFiles && mappedFiles.length > 0) {
      response = await this.awsFileUploader.upload(mappedFiles) as string[];
    }
    return response;
  }
}