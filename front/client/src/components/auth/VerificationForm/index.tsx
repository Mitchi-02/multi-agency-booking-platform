"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ValidationSchema } from "@/lib/schemas/user"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updateSession } from "@/actions/updateSession"
import { ValidationSchemaType } from "@/lib/types/user"
import { resendEmailVerification, verifyEmail } from "@/api/auth"

export default function VerificationForm() {
  const router = useRouter()
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const params = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchemaType>({ resolver: zodResolver(ValidationSchema) })

  const VerificationMutation = {
    mutationFn: verifyEmail,
    onSuccess: async (data: any) => {
      toast.success(data.data.message)
      await updateSession({ user: data.data.data.user, accessToken: data.data.data.token })
      if (params.get("callback")) router.push(params.get("callback") ?? "/")
      else router.push("/")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(VerificationMutation)
  const { isPending } = mutation
  const onSubmit: SubmitHandler<ValidationSchemaType> = (data) => {
    mutation.mutate(data)
  }
  const resend = () => {
    if (resendDisabled) return

    resendEmailVerification()
      .then(() => {
        toast.success("Code has been sent to your email")
        setResendDisabled(true)
        startCountdown()
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const startCountdown = () => {
    setCountdown((prevCountdown) => {
      if (prevCountdown <= 1) {
        setResendDisabled(false)
        return 60
      } else {
        setTimeout(startCountdown, 1000)
        return prevCountdown - 1
      }
    })
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-sm text-gray-600">We have send code to your email</div>
        <div className="flex flex-col gap-1">
          <label className={`${errors.code && "text-red-500"} text-sm`} htmlFor="code">
            Code
          </label>
          <input
            className={`min-w-72 rounded-md border bg-input_bg px-3  py-2  text-lg focus:outline-none ${errors.code && "border-red-500"}`}
            id="code"
            maxLength={6}
            placeholder="######"
            {...register("code")}
          />
          {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
        </div>
        <Button variant="primary" className="w-full" type="submit">
          {isPending ? <Spinner /> : "Verify account"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <span>Didn&apos;t receive code ?</span>&nbsp;
        <Button variant="outline" className="text-primary_color" onClick={resend} disabled={resendDisabled}>
          {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
        </Button>
      </div>
    </>
  )
}
