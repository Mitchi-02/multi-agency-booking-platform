import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ReviewSchema } from "@/lib/schemas/review"
import { ReviewSchemaType } from "@/lib/types/review"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  mutate: (review: ReviewSchemaType) => void
  loading: boolean
}

export default function ReviewForm({ mutate, loading, className, ...rest }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewSchemaType>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      comment: "",
      rating: 0
    }
  })
  return (
    <form {...rest} className={cn("max-w-[30rem]", className)} onSubmit={handleSubmit(mutate)}>
      <h4 className="pb-5 text-2xl font-bold">Drop your review here</h4>
      <div>
        <Label htmlFor={`rating`} className="block pb-2 font-medium text-primary-gray">
          Rating
        </Label>
        <Input
          type="number"
          {...register("rating", {
            valueAsNumber: true
          })}
          className={cn(
            "bg-white px-4 py-3 text-sm text-primary-black shadow-none focus-visible:border-primary-black",
            errors?.rating && "border-error focus-visible:border-error"
          )}
          id={`rating`}
        />
        <p className={cn("pt-1 text-sm text-error", !errors?.rating && "opacity-0")}>{errors?.rating?.message}</p>
      </div>
      <div className="pt-5">
        <Label htmlFor={`comment`} className="block pb-2 font-medium text-primary-gray">
          Comment
        </Label>
        <Textarea
          {...register("comment")}
          className={cn(
            "bg-white px-4 py-3 text-sm text-primary-black shadow-none focus-visible:border-primary-black",
            errors?.comment && "border-error focus-visible:border-error"
          )}
          id={`comment`}
        />
        <p className={cn("pt-1 text-sm text-error", !errors?.comment && "opacity-0")}>{errors?.comment?.message}</p>
      </div>
      <Button
        variant="primary"
        disabled={loading}
        className={cn("mt-10 block h-auto w-full rounded-lg px-6 py-3 text-lg")}
        type="submit"
      >
        {loading ? <Spinner className="mx-auto size-7 fill-primary-black text-white" /> : "Submit"}
      </Button>
    </form>
  )
}
