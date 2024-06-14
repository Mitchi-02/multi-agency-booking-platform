import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"

export default function PlanStep({
  titleError,
  descriptionError,
  title,
  description,
  onChangeTitle,
  onChangeDescription,
  index,
  onDelete
}: {
  titleError?: string
  descriptionError?: string
  index: number
  title: string
  description: string
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onDelete: () => void
}) {
  return (
    <article className="relative rounded-md border-2 border-dashed border-slate-200 px-3 py-6">
      <button
        className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-error p-2 text-white"
        onClick={onDelete}
        type="button"
      >
        <Trash2 className="h-5 w-5" />
      </button>
      <div>
        <Label className={`${titleError && "text-red-500"} text-sm font-semibold`} htmlFor={`title-${index}`}>
          Title
        </Label>
        <Input
          value={title}
          onChange={onChangeTitle}
          className={`${titleError && "border-red-500"}`}
          placeholder="Title..."
          id={`title-${index}`}
        />
        {titleError && <span className="text-xs text-red-500">{titleError}</span>}
      </div>
      <div className="pt-2">
        <Label
          className={`${descriptionError && "text-red-500"} text-sm font-semibold`}
          htmlFor={`description-${index}`}
        >
          Description
        </Label>
        <Textarea
          value={description}
          onChange={onChangeDescription}
          className={`${descriptionError && "border-red-500"}`}
          placeholder="Description..."
          id={`description-${index}`}
        />
        {descriptionError && <span className="text-xs text-red-500">{descriptionError}</span>}
      </div>
    </article>
  )
}
