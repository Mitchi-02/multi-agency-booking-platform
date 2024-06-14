"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { AddUserSchema, Role } from "@/lib/schemas/user"
import { createUser } from "@/api/user"
import usePagination from "@/lib/hooks/usePagination"
import { paginateTravelAgencies } from "@/api/travel_agency"
import { paginateHikeAgencies } from "@/api/hike_agency"
import { AddUserSchemaType } from "@/lib/types/user"
import { Label } from "@/components/ui/label"
import queryClient from "@/lib/queryClient"

export default function AddTravelAgencyForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AddUserSchemaType>({ resolver: zodResolver(AddUserSchema), defaultValues: { role: Role.CLIENT } })

  const AddUserMutation = {
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User added successfully")
      router.push("/users")
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(AddUserMutation)
  const { isPending } = mutation

  const { data: travel_agencies } = usePagination({
    fetchMethod: paginateTravelAgencies,
    queryKey: "travels"
  })

  const { data: hike_agencies } = usePagination({
    fetchMethod: paginateHikeAgencies,
    queryKey: "hikes"
  })

  const role = watch("role")
  const organizations = role === Role.HIKE_AGENT ? hike_agencies : role === Role.TRAVEL_AGENT ? travel_agencies : null

  const onSubmit: SubmitHandler<AddUserSchemaType> = (data) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">Add a new user to TripX</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">
        Here you can create a new user and fill the required fields
      </h2>
      <div className="my-6 grid grid-cols-3 justify-between gap-10 rounded-lg bg-[#FCFCFC] p-6">
        {/* First Name */}
        <div className="w-full">
          <Label className={`${errors.first_name && "text-red-500"} text-sm font-semibold`} htmlFor="first_name">
            First Name
          </Label>
          <Input
            className={` ${errors.first_name && "border-red-500"}`}
            placeholder="Enter your First Name"
            id="first_name"
            {...register("first_name")}
          />
          {errors.first_name && <span className="text-xs text-red-500">{errors.first_name.message}</span>}
        </div>

        {/* Last Name */}
        <div className="w-full">
          <Label className={`${errors.last_name && "text-red-500"} text-sm font-semibold`} htmlFor="last_name">
            Last Name
          </Label>
          <Input
            className={` ${errors.last_name && "border-red-500"}`}
            placeholder="Enter your Last Name"
            id="last_name"
            {...register("last_name")}
          />
          {errors.last_name && <span className="text-xs text-red-500">{errors.last_name.message}</span>}
        </div>

        {/* Email */}
        <div className="w-full">
          <Label className={`${errors.email && "text-red-500"} text-sm font-semibold`} htmlFor="email">
            Email
          </Label>
          <Input
            className={` ${errors.email && "border-red-500"}`}
            placeholder="Enter your email"
            id="email"
            {...register("email")}
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
        {/* Password */}
        <div className="w-full">
          <Label className={`${errors.password && "text-red-500"} text-sm font-semibold`} htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            className={` ${errors.password && "border-red-500"}`}
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="w-full">
          <Label
            className={`${errors.confirm_password && "text-red-500"} text-sm font-semibold`}
            htmlFor="confirm_password"
          >
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirm_password"
            className={` ${errors.confirm_password && "border-red-500"}`}
            placeholder="Confirm your password"
            {...register("confirm_password")}
          />
          {errors.confirm_password && <span className="text-xs text-red-500">{errors.confirm_password.message}</span>}
        </div>

        {/* Role */}
        <div className="flex w-full flex-col gap-1">
          <Label className={`${errors.role && "text-red-500"} text-sm font-semibold`} htmlFor="role">
            Role
          </Label>
          <select
            className="bg-input_bg flex w-full rounded-md  border   bg-white  px-3 py-2 text-sm shadow-sm transition-colors   placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            id="role"
            {...register("role")}
          >
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
        </div>

        <div className="w-full">
          <Label className={`${errors.gender && "text-red-500"} text-sm font-semibold`} htmlFor="gender">
            Gender
          </Label>
          <select
            className="bg-input_bg flex w-full rounded-md  border   bg-white  px-3 py-2 text-sm shadow-sm transition-colors   placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            id="gender"
            {...register("gender")}
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
        </div>

        {/* Phone */}
        <div className="w-full">
          <Label className={`${errors.phone && "text-red-500"} text-sm font-semibold`} htmlFor="phone">
            Phone
          </Label>
          <Input
            className={` ${errors.phone && "border-red-500"}`}
            placeholder="Enter your Phone"
            id="phone"
            {...register("phone")}
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>

        {/* Address */}
        <div className="w-full">
          <Label className={`${errors.address && "text-red-500"} text-sm font-semibold`} htmlFor="address">
            Address
          </Label>
          <Input
            className={` ${errors.address && "border-red-500"}`}
            placeholder="Enter your Address"
            id="address"
            {...register("address")}
          />
          {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        </div>

        {/* Birth Date */}
        <div className="w-full">
          <Label className={`${errors.birth_date && "text-red-500"} text-sm font-semibold`} htmlFor="birth_date">
            Birth Date
          </Label>
          <Input
            className={` ${errors.birth_date && "border-red-500"}`}
            type="date"
            placeholder="Enter your Birth Date"
            id="birth_date"
            {...register("birth_date")}
          />
          {errors.birth_date && <span className="text-xs text-red-500">{errors.birth_date.message}</span>}
        </div>

        {(role === Role.TRAVEL_AGENT || role === Role.HIKE_AGENT) && (
          <div className="flex w-full flex-col gap-1">
            <Label className={`${errors.organization_id && "text-red-500"} text-sm font-semibold`} htmlFor="role">
              Organization
            </Label>
            <select
              className="bg-input_bg flex w-full rounded-md  border   bg-white  px-3 py-2 text-sm shadow-sm transition-colors   placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              id="organization_id"
              {...register("organization_id")}
            >
              {organizations?.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
          </div>
        )}
        <div className="col-span-3 mt-6 flex items-center justify-end gap-4">
          <Link href={"/users"}>
            <Button variant={"outline"}>Discard</Button>
          </Link>
          <Button disabled={mutation.isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {isPending ? <Spinner /> : "Create"}
          </Button>
        </div>
      </div>
    </form>
  )
}
