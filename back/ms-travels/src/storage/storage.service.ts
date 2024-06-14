import { Storage } from "@google-cloud/storage"
import { Injectable } from "@nestjs/common"
import { randomUUID } from "crypto"
import { MemoryStoredFile } from "nestjs-form-data"

@Injectable()
export class StorageService {
  private storage: Storage
  private bucket: string
  public static readonly BASE_URL = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/`
  private static readonly DEFAULT_PHOTOS = [
    `travel-agencies/logos/logo.png`,
    `travel-agencies/images/1.png`,
    `travel-agencies/images/2.png`,
    `travel-agencies/images/3.png`,
    `travel-agencies/images/4.png`,
    "travels/1.png",
    "travels/2.png",
    "travels/3.png",
    "travels/4.png"
  ]

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY.split(String.raw`\n`).join("\n")
      }
    })

    this.bucket = process.env.GOOGLE_STORAGE_BUCKET
  }

  saveMany(basePath: string, ...files: MemoryStoredFile[]) {
    return files.map((f) => {
      //@ts-ignore
      f.originalName = `${basePath}${randomUUID()}.${f.fileType.ext}`
      this.storage.bucket(this.bucket).file(f.originalName).save(f.buffer)
      return f.originalName
    })
  }

  saveOne(basePath: string, file: MemoryStoredFile) {
    //@ts-ignore
    file.originalName = `${basePath}${randomUUID()}.${file.fileType.ext}`
    this.storage.bucket(this.bucket).file(file.originalName).save(file.buffer)
    return file.originalName
  }

  delete(...paths: string[]) {
    paths
      .filter((p) => !!p)
      .forEach((path) => {
        const temp = path.replace(StorageService.BASE_URL, "")
        if (StorageService.DEFAULT_PHOTOS.includes(temp)) return
        this.storage.bucket(this.bucket).file(temp).delete({ ignoreNotFound: true })
      })
  }
}
