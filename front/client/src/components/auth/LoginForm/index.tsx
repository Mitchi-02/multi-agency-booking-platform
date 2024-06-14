"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import { LoginSchema } from "@/lib/schemas/user"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "react-toastify"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/api/auth"
import { updateSession } from "@/actions/updateSession"
import { LoginSchemaType } from "@/lib/types/user"

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const params = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) })

  const signInMutation = {
    mutationFn: login,
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
    onSuccess: async (data: any) => {
      await updateSession({ user: data.data.user, accessToken: data.data.token })
      toast.success("Logged in successfully")

      if (data.data.user.verified === false) router.push("/verification")
      else if (params.get("callback") && params.get("callback") !== "/verification") {
        router.push(params.get("callback") ?? "/")
      } else router.push("/")
    }
  }

  const mutation = useMutation(signInMutation)
  const { isPending } = mutation

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    mutation.mutate(data)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label className={`${errors.email && "text-red-500"} text-sm`} htmlFor="email">
          Email Address
        </label>
        <Input
          className={` ${errors.email && "border-red-500"} min-w-80`}
          id="email"
          placeholder="Enter your email "
          {...register("email")}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label className={`${errors.password && "text-red-500"} text-sm`} htmlFor="email">
          Password
        </label>
        <div className="relative">
          <Input
            className={` ${errors.password && "border-red-500"}`}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-5" // Adjust positioning to be inside the input
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <BsEyeSlash className="h-5 w-5 text-gray-500" />
            ) : (
              <BsEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        <Link href="/forgotpassword" className="self-end text-xs text-primary_color hover:underline">
          Forgot your password ?
        </Link>
      </div>
      <Button disabled={mutation.isPending} variant="primary" className="w-full" type="submit">
        {isPending ? <Spinner /> : "Sign in"}
      </Button>
    </form>
  )
}
