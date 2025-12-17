"use client"

import type React from "react"

import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadSectionProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
  isProcessing: boolean
}

export function UploadSection({ onFileUpload, uploadedFile, isProcessing }: UploadSectionProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type === "application/pdf") {
        onFileUpload(file)
      }
    },
    [onFileUpload],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileUpload(file)
      }
    },
    [onFileUpload],
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-12 transition-colors",
            "hover:border-primary hover:bg-muted/50",
            uploadedFile && "border-primary bg-primary/5",
          )}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isProcessing}
          />

          {isProcessing ? (
            <>
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Processing RFP...</p>
              <p className="mt-1 text-xs text-muted-foreground">Analyzing requirements and matching products</p>
            </>
          ) : uploadedFile ? (
            <>
              <FileText className="mb-4 h-12 w-12 text-primary" />
              <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Click or drag to replace</p>
            </>
          ) : (
            <>
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Drop your RFP PDF here, or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF files only, up to 10MB</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
