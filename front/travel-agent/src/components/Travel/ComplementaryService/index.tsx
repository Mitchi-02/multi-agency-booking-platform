import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

export default function ComplementaryService({
  nameError,
  priceError,
  name,
  price,
  onChangeName,
  onChangePrice,
  typeError,
  onChangeType,
  type,
  index,
  onDelete,
  types
}: {
  nameError?: string
  priceError?: string
  index: number
  name: string
  price: number
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePrice: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
  typeError?: string
  onChangeType: (s: string) => void
  type: string
  types: string[]
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
        <Label className={`${nameError && "text-red-500"} text-sm font-semibold`} htmlFor={`name-${index}`}>
          Name
        </Label>
        <Input
          value={name}
          onChange={onChangeName}
          className={`${nameError && "border-red-500"}`}
          placeholder="Name..."
          id={`name-${index}`}
        />
        {nameError && <span className="text-xs text-red-500">{nameError}</span>}
      </div>
      <div className="pt-2">
        <Label className={`${priceError && "text-red-500"} text-sm font-semibold`} htmlFor={`price-${index}`}>
          Price
        </Label>
        <Input
          type="number"
          value={price}
          onChange={onChangePrice}
          className={`${priceError && "border-red-500"}`}
          placeholder="Price..."
          id={`price-${index}`}
        />
        {priceError && <span className="text-xs text-red-500">{priceError}</span>}
      </div>
      <div className="pt-2">
        <Label className={`${typeError && "text-red-500"} text-sm font-semibold`} htmlFor={`type-${index}`}>
          Type
        </Label>
        <Select onValueChange={onChangeType} value={type}>
          <SelectTrigger className={`${typeError && "border-red-500"} w-full capitalize`}>
            <SelectValue placeholder="Type..." />
          </SelectTrigger>
          <SelectContent id={`type-${index}`}>
            {types.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {typeError && <span className="text-xs text-red-500">{typeError}</span>}
      </div>
    </article>
  )
}
