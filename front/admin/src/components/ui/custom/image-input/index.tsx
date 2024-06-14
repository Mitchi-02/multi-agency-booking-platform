import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function ImageFormControl({
  imageState,
  register,
  error,
  setValue
}: {
  imageState: File | string | undefined
  register: UseFormRegisterReturn<string>
  error?: string
  label: string
  setValue: (s: File) => void
}) {
  return (
    <div className="mt-6 flex h-48 w-56 justify-center">
      <input type="hidden" {...register} />
      <label className="flex  w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 px-3 py-6">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (!e.target.files) return
            setValue(e.target.files[0])
          }}
        />
        {!imageState && (
          <div className="flex flex-col items-center justify-center">
            <Image src={"/icons/image-upload.svg"} width={60} height={60} alt="upload" />
            <p className="mt-4 text-gray-500">Drag & Drop a photo</p>
          </div>
        )}
        {imageState && (
          <div className="relative h-fit w-fit rounded-md p-2 ">
            <Image
              id="child"
              className="rounded"
              src={typeof imageState === "string" ? imageState : URL.createObjectURL(imageState)}
              width={150}
              height={150}
              alt="ilyes"
            />
          </div>
        )}
      </label>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
