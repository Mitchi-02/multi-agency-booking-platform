"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Spinner } from "../../ui/spinner"
import { useRouter } from "next/navigation"
import { ChangePasswordSchema } from "@/lib/schemas/user"
import { ChangePasswordSchemaType } from "@/lib/types/user"
import { resetPassword } from "@/api/auth"

export const ChangePasswordForm = ({ email }: { email: string }) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordSchemaType>({ resolver: zodResolver(ChangePasswordSchema) })

  const ChangePasswordMutation = {
    mutationFn: resetPassword,
    onSuccess: async (data: any) => {
      toast.success(data.data.message)
      router.push("/login")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(ChangePasswordMutation)
  const { isPending } = mutation
  const onSubmit: SubmitHandler<{ code: string; password: string; confirm_password: string }> = (data) => {
    const body = { ...data, email }
    mutation.mutate(body)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-sm text-gray-600">We have send code to your email</div>
      <div className="flex flex-col gap-1">
        <label className={`${errors.code && "text-red-500"} text-sm`} htmlFor="code">
          Code
        </label>
        <input
          className={`bg-input_bg min-w-72 rounded-md border px-3  py-2  text-lg focus:outline-none ${errors.code && "border-red-500"}`}
          id="code"
          maxLength={6}
          placeholder="######"
          {...register("code")}
        />
        {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label className={`${errors.password && "text-red-500"} text-sm`} htmlFor="password">
          New Password
        </label>
        <input
          className={`bg-input_bg min-w-72 rounded-md border px-3  py-2  text-lg focus:outline-none ${errors.password && "border-red-500"}`}
          id="password"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label className={`${errors.confirm_password && "text-red-500"} text-sm`} htmlFor="confirm_password">
          Confirm New Password
        </label>
        <input
          className={`bg-input_bg min-w-72 rounded-md border px-3  py-2  text-lg focus:outline-none ${errors.confirm_password && "border-red-500"}`}
          id="confirm_password"
          type="password"
          placeholder="Confirm Password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && <span className="text-xs text-red-500">{errors.confirm_password.message}</span>}
      </div>
      <Button variant="primary" className="w-full" type="submit">
        {isPending ? <Spinner /> : "Verify account"}
      </Button>
    </form>
  )
}
