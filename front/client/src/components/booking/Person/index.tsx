import { HikeComplementaryService } from "@/api/hike/types"
import { TravelComplementaryService } from "@/api/travel/types"
import MultiSelectFilter from "@/components/global/booking/Filters/MultiSelectFilter"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, formatPrice } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from "react-hook-form"
import { CrossCircledIcon } from "@radix-ui/react-icons"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  registerName: UseFormRegisterReturn<`${"adults" | "kids"}.${number}.full_name`>
  registerPhone: UseFormRegisterReturn<`${"adults" | "kids"}.${number}.phone`>
  registerServices: UseFormRegisterReturn<`${"adults" | "kids"}.${number}.chosen_services`>
  index: number
  services: TravelComplementaryService[] | HikeComplementaryService[]
  selected_services: string[]
  setServices: (services: string[]) => void
  errors?: Merge<
    FieldError,
    FieldErrorsImpl<{
      full_name: string
      phone: string
      chosen_services: string[]
    }>
  >
  onDelete: () => void
  deletable?: boolean
}

export default function Person({
  registerName,
  registerPhone,
  registerServices,
  index,
  services,
  selected_services,
  setServices,
  className,
  errors,
  deletable,
  onDelete,
  ...props
}: Props) {
  return (
    <article
      className={cn(
        "relative grid grid-cols-2 gap-x-4 gap-y-6 rounded-lg border border-input_bg px-6 py-5 has-[*:focus,input:focus-visible]:border-primary-black",
        (errors?.full_name || errors?.phone) && "border-error has-[*:focus,input:focus-visible]:border-error",
        className
      )}
      {...props}
    >
      {deletable && (
        <button
          type="button"
          className="absolute bottom-full right-0 translate-x-1/2 translate-y-1/2 rounded-full bg-error"
          onClick={onDelete}
        >
          <CrossCircledIcon className="h-7 w-7 text-white" />
        </button>
      )}
      <input type="hidden" {...registerServices} />
      <div>
        <Label htmlFor={`full_name_${index}`} className="block pb-2 font-medium text-primary-gray">
          Full name
        </Label>
        <Input
          type="text"
          {...registerName}
          className={cn(
            "bg-white px-4 py-3 text-sm text-primary-black shadow-none focus-visible:border-primary-black",
            errors?.full_name && "border-error focus-visible:border-error"
          )}
          id={`full_name_${index}`}
        />
        <p className={cn("pt-1 text-sm text-error", !errors?.full_name && "opacity-0")}>{errors?.full_name?.message}</p>
      </div>
      <div>
        <Label htmlFor={`phone_${index}`} className="block pb-2 font-medium text-primary-gray">
          Phone
        </Label>
        <Input
          type="text"
          {...registerPhone}
          className={cn(
            "bg-white px-4 py-3 text-sm text-primary-black shadow-none focus-visible:border-primary-black",
            errors?.phone && "border-error focus-visible:border-error"
          )}
          id={`phone_${index}`}
        />{" "}
        <p className={cn("pt-1 text-sm text-error", !errors?.phone && "opacity-0")}>{errors?.phone?.message}</p>
      </div>
      <MultiSelectFilter
        labelProps={{
          className: "text-primary-gray pb-3"
        }}
        className="col-span-2"
        accessor="id"
        data={services.map((s) => ({
          id: s.name,
          name: s.name,
          extra: formatPrice(s.price)
        }))}
        label="Complementary services"
        listStyle="space-y-0 grid gap-x-8 gap-y-4 grid-cols-2"
        isLoading={false}
        onUpdate={setServices}
        durations={selected_services}
      />
    </article>
  )
}
