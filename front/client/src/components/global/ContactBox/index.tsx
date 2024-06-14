"use client"

import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactFormType } from "@/lib/types/user"
import { ContactScehma } from "@/lib/schemas/user"
import { useMutation } from "@tanstack/react-query"
import { CustomAxiosError, SuccessResponse } from "@/api/types"
import { requestAgency } from "@/api/request"
import { toast } from "react-toastify"
import { Spinner } from "@/components/ui/spinner"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function ContactBox({ className, ...props }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<ContactFormType>({
    resolver: zodResolver(ContactScehma)
  })

  const { mutate, isPending } = useMutation<SuccessResponse<any>, CustomAxiosError, ContactFormType>({
    mutationFn: (d) => requestAgency(d.email),
    onError: (e) => {
      toast.error(e.response.data.message)
    },
    onSuccess: () => {
      toast.success("Request saved successful")
    },
    mutationKey: ["requestAgency"]
  })

  const onSubmit: SubmitHandler<ContactFormType> = (data) => {
    mutate(data)
  }

  return (
    <section
      className={cn("page-container page-container-xs rounded-2xl bg-primary-blue px-24 py-16 font-dm-sans", className)}
      {...props}
    >
      <div className="flex items-center gap-10">
        <div className="shrink-0 text-white">
          <h2 className="pb-4 font-poppins text-3xl font-bold">Looking for collaboration?</h2>
          <p className="max-w-[30rem]">
            You&apos;re an agency or organizer looking to collaborate? Just drop your email here, and we’ll reach you
            asap!
          </p>
        </div>
        <form className="grow" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4 rounded-sm bg-white px-3 py-2">
            <Input
              {...register("email")}
              type="text"
              className="border-none bg-transparent font-medium shadow-none"
              placeholder="ex: zahdour@agency.com"
            />
            <Button type="submit" className="h-auto bg-primary-black px-6 py-3 text-base">
              {isPending ? <Spinner className="size-6 fill-primary-black text-white" /> : <>Confirm</>}
            </Button>
          </div>
          {errors.email && <p className="pt-1 text-sm text-error">{errors.email.message}</p>}
        </form>
      </div>
    </section>
  )
}
