'use client'

import { useState } from 'react'
import { FileDropZone } from './FileDropZone'
import { FileUploadCard } from './FileUploadCard'
import { CHUNK_SIZE } from '~/config/upload'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { uploadChunk } from './utils'
import toast from 'react-hot-toast'
import type { FileStatus } from '../share'

interface Props {
  onSuccess: (
    storage: string,
    hash: string,
    content: string,
    size: string
  ) => void
  handleRemoveFile: () => void
}

export const FileUploadContainer: React.FC<Props> = ({
  onSuccess,
  handleRemoveFile
}) => {
  const [fileData, setFileData] = useState<FileStatus | null>(null)

  const handleFileUpload = async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024)
    if (!file) {
      toast.error('未选择补丁资源文件')
      return
    }

    setFileData({ file, uploadStatus: 1, progress: 0 })

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      const response = await uploadChunk(file, chunk, i, fileId, totalChunks)
      if (typeof response === 'string') {
        return
      }

      const progress = Math.round(((i + 1) / totalChunks) * 100)
      setFileData((prev) => (prev ? { ...prev, progress } : null))

      if (i === totalChunks - 2) {
        setFileData((prev) => (prev ? { ...prev, uploadStatus: 2 } : null))
      }

      if (response.fileHash) {
        setFileData((prev) =>
          prev
            ? {
                ...prev,
                uploadStatus: 3,
                hash: response.fileHash,
                filetype: file.type
              }
            : null
        )
        onSuccess(
          's3',
          response.fileHash,
          `${kunMoyuMoe.domain.storage}/${response.fileHash}`,
          `${fileSizeMB.toFixed(3).toString()} MB`
        )
      }
    }
  }

  const removeFile = () => {
    setFileData(null)
    handleRemoveFile()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">上传资源</h3>
      <p className="text-sm text-default-500">
        您的文件在上传后将会被去除特殊字符, 仅保留下划线 ( _ ) 或连字符 ( - ),
        以及后缀
      </p>

      {!fileData ? (
        <FileDropZone onFileUpload={handleFileUpload} />
      ) : (
        <FileUploadCard fileData={fileData} onRemove={removeFile} />
      )}
    </div>
  )
}
