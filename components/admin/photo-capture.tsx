"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, Upload, X, RefreshCw } from "lucide-react"

export type CapturedPhoto = { pathname: string; preview: string }

export function PhotoCapture({
  photos,
  onChange,
}: {
  photos: CapturedPhoto[]
  onChange: (photos: CapturedPhoto[]) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  async function startCamera() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
    } catch {
      setError("No se pudo acceder a la cámara. Podés subir fotos desde el dispositivo.")
    }
  }

  async function uploadBlob(blob: Blob, filename: string) {
    const fd = new FormData()
    fd.append("file", new File([blob], filename, { type: blob.type }))
    const res = await fetch("/api/warehouse/photo", { method: "POST", body: fd })
    if (!res.ok) throw new Error("upload failed")
    const data = (await res.json()) as { pathname: string }
    return data.pathname
  }

  async function capture() {
    const video = videoRef.current
    if (!video) return
    setUploading(true)
    setError(null)
    try {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("no ctx")
      ctx.drawImage(video, 0, 0)
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/jpeg", 0.85),
      )
      const preview = canvas.toDataURL("image/jpeg", 0.5)
      const pathname = await uploadBlob(blob, "capture.jpg")
      onChange([...photos, { pathname, preview }])
    } catch {
      setError("No se pudo guardar la foto. Intentá de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  async function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      const added: CapturedPhoto[] = []
      for (const file of files) {
        const preview = URL.createObjectURL(file)
        const pathname = await uploadBlob(file, file.name)
        added.push({ pathname, preview })
      }
      onChange([...photos, ...added])
    } catch {
      setError("No se pudieron subir las fotos.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  function removePhoto(pathname: string) {
    onChange(photos.filter((p) => p.pathname !== pathname))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
        <div className="relative aspect-video w-full bg-slate-900">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} playsInline muted className="h-full w-full object-contain" />
          {!cameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Camera className="h-10 w-10" />
              <p className="text-sm">La cámara está apagada</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-card p-3">
          {!cameraOn ? (
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              <Camera className="h-4 w-4" /> Encender cámara
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={capture}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
              >
                <Camera className="h-4 w-4" /> {uploading ? "Guardando..." : "Capturar foto"}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" /> Apagar
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> Subir archivo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFilePicked}
            className="hidden"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.pathname} className="group relative overflow-hidden rounded-xl border border-border">
              {/* Preview uses the local object/data URL captured client-side */}
              <img src={p.preview || "/placeholder.svg"} alt="Foto del paquete" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(p.pathname)}
                className="absolute right-1 top-1 rounded-full bg-slate-900/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Eliminar foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3" /> Las fotos se guardan de forma segura y quedan visibles para el cliente.
      </p>
    </div>
  )
}
