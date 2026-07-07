import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

import type { MultipartFile } from '@fastify/multipart'
import { randomUUID } from 'node:crypto'

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

export async function uploadImage(
  file?: MultipartFile
): Promise<string | null> {
  if (!file) {
    return null
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      'Formato de imagem inválido. Utilize JPG, JPEG, PNG ou WEBP.'
    )
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  const extension = path.extname(file.filename)

  const fileName = `${randomUUID()}${extension}`

  const destination = path.join(UPLOAD_DIR, fileName)

  await pipeline(file.file, fs.createWriteStream(destination))

  return `/uploads/${fileName}`
}

export function deleteImage(imageUrl?: string | null) {
  if (!imageUrl) {
    return
  }

  const filePath = path.resolve(
    process.cwd(),
    imageUrl.replace(/^\//, '')
  )

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}