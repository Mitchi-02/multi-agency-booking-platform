import { Trash2 } from "lucide-react";
import Image from "next/image"

export default function ReadOnlyImage({ imageState, onDelete }: { imageState: File | string; onDelete: () => void }) {
  return (
    <article className="relative aspect-square w-fit rounded-md border-2 border-dashed border-slate-200 px-3 py-6">
      <button
        className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-error p-2 text-white"
        onClick={onDelete}
        type="button"
      >
        <Trash2 className="h-5 w-5" />
      </button>
      <Image
        id="child"
        className="h-full w-full rounded object-cover"
        src={typeof imageState === "string" ? imageState : URL.createObjectURL(imageState)}
        width={150}
        height={150}
        alt="ilyes"
      />
    </article>
  )
}
