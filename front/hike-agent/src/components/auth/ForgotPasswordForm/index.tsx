"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../ui/button"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"
import { ChangePasswordForm } from "../ChangePasswordForm"
import { useState } from "react"
import { Spinner } from "../../ui/spinner"
import { ForgotPasswordSchema } from "@/lib/schemas/user"
import { ForgotPasswordSchemaType } from "@/lib/types/user"
import { sendResetPasswordEmail } from "@/api/auth"

export const ForgotPasswordForm = () => {
  const [showChangePassForm, setShowChangePassForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordSchemaType>({ resolver: zodResolver(ForgotPasswordSchema) })

  const forgotMutation = {
    mutationFn: sendResetPasswordEmail,
    onError: (error: any) => {
      toast.error(error.message)
    },
    onSuccess: (data: any) => {
      toast.success(data.message)
      setShowChangePassForm(true)
    }
  }

  const mutation = useMutation(forgotMutation)
  const { isPending } = mutation

  const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = (data) => {
    mutation.mutate(data)
  }
  return (
    <>
      {showChangePassForm ? (
        <ChangePasswordForm email={getValues("email")} />
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label className={`${errors.email && "text-red-500"} text-sm`} htmlFor="email">
              Email Address
            </label>
            <input
              className={`bg-input_bg min-w-72 rounded-md border px-3 py-2 focus:outline-none ${errors.email && "border-red-500"}`}
              id="email"
              placeholder="Enter your email "
              {...register("email")}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <Button variant="primary" className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Send Password"}
          </Button>
        </form>
      )}
    </>
  )
}
