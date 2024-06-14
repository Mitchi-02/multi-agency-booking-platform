"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import { SignUpSchema } from "@/lib/schemas/user"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { register as registerUser } from "@/api/auth"
import { updateSession } from "@/actions/updateSession"
import { SignUpSchemaType } from "@/lib/types/user"

export default function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) })

  const SignupMutation = {
    mutationFn: registerUser,
    onSuccess: async (data: any) => {
      toast.success(data.message)
      const user = data.data.user
      const accessToken = data.data.token
      await updateSession({ user, accessToken })
      router.push("/verification")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(SignupMutation)
  const { isPending } = mutation
  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    mutation.mutate(data)
  }

  return (
    <form className=" space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <label className={`${errors.first_name && "text-red-500"} text-sm`} htmlFor="first_name">
            First Name
          </label>
          <Input
            className={` ${errors.first_name && "border-red-500"} `}
            id="first_name"
            placeholder="First Name"
            {...register("first_name")}
          />

          {errors.first_name && <span className="text-xs text-red-500">{errors.first_name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className={`${errors.last_name && "text-red-500"} text-sm`} htmlFor="last_name">
            Last Name
          </label>
          <Input
            className={` ${errors.last_name && "border-red-500"}`}
            id="last_name"
            placeholder="Last Name"
            {...register("last_name")}
          />
          {errors.last_name && <span className="text-xs text-red-500">{errors.last_name.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={`${errors.email && "text-red-500"} text-sm`} htmlFor="email">
          Email Address
        </label>
        <Input
          className={`${errors.email && "border-red-500"}`}
          id="email"
          placeholder="Enter your email "
          {...register("email")}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className={`${errors.phone && "text-red-500"} text-sm`} htmlFor="phone">
            Phone Number
          </label>
          <Input
            className={` ${errors.phone && "border-red-500"}`}
            id="phone"
            placeholder="Phone Number"
            {...register("phone")}
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className={`${errors.address && "text-red-500"} text-sm`} htmlFor="address">
            Address
          </label>
          <Input
            className={` ${errors.address && "border-red-500"}`}
            id="address"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className={`${errors.birth_date && "text-red-500"} text-sm`} htmlFor="birth_date">
            Birth Date
          </label>
          <Input
            className={` ${errors.birth_date && "border-red-500"} px-10`}
            id="birth_date"
            type="date"
            placeholder="Birthdate"
            {...register("birth_date")}
          />
          {errors.birth_date && <span className="text-xs text-red-500">{errors.birth_date.message}</span>}
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm">Gender</label>
          <div className="flex gap-10">
            <div className="flex items-center gap-2">
              <input
                className={` ${errors.gender && "border-red-500"}`}
                id="male"
                type="radio"
                value="MALE"
                {...register("gender")}
              />
              <label htmlFor="male" className="text-sm">
                Male
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                className={` ${errors.gender && "border-red-500"}`}
                id="female"
                type="radio"
                value="FEMALE"
                {...register("gender")}
              />
              <label htmlFor="female" className="text-sm">
                Female
              </label>
            </div>
          </div>
          {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
        </div>{" "}
      </div>
      {/*  */}
      <div className="flex flex-col gap-1">
        <label className={`${errors.password && "text-red-500"} text-sm`} htmlFor="email">
          Password
        </label>
        <div className="relative">
          <Input
            className={`${errors.password && "border-red-500"}`}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-5" // Adjust positioning and padding for responsiveness
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <BsEyeSlash className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" /> // Adjust icon size for responsiveness
            ) : (
              <BsEye className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" /> // Adjust icon size for responsiveness
            )}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className={`${errors.confirm_password && "text-red-500"} text-sm`} htmlFor="email">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            className={`${errors.confirm_password && "border-red-500"}`}
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            {...register("confirm_password", {
              validate: (value) => value === getValues("password") || "Passwords do not match"
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-5" // Adjust positioning and padding for responsiveness
            onClick={() => setShowConfirmPassword((c) => !c)}
          >
            {showConfirmPassword ? (
              <BsEyeSlash className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" /> // Adjust icon size for responsiveness
            ) : (
              <BsEye className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" /> // Adjust icon size for responsiveness
            )}
          </button>
        </div>
        {errors.confirm_password && <span className="text-xs text-red-500">{errors.confirm_password.message}</span>}
      </div>

      <Button disabled={mutation.isPending} variant="primary" className="w-full" type="submit">
        {isPending ? <Spinner /> : "Sign up"}
      </Button>
    </form>
  )
}
