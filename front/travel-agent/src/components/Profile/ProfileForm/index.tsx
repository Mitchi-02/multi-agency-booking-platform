"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProfileSchema } from "@/lib/schemas/user"
import { useMutation } from "@tanstack/react-query"
import { updateUser } from "@/api/auth"
import { Spinner } from "@/components/ui/spinner"
import { updateSession } from "@/actions/updateSession"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { ProfileSchemaType } from "@/lib/types/user"
import { IAgency, IUser } from "@/api/auth/types"
import { useState } from "react"

export default function ProfileForm({ user, agency }: { user: IUser; agency: IAgency }) {
  const router = useRouter()
  const [allowEdit, setAllowEdit] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      address: user.address ?? "",
      phone: user.phone ?? "",
      birth_date: user.birth_date ?? "",
      gender: user.gender as any
    }
  })

  const EditMutation = {
    mutationFn: updateUser,
    onSuccess: async (data: any) => {
      await updateSession({ user: data.data.user, accessToken: data.data.token, agency })
      setAllowEdit(false)
      toast.success(data.message)
      if (!data.data.user.verified) {
        toast.info("Please verify your email to continue")
        router.push("/verification")
      }
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  }

  const mutation = useMutation(EditMutation)
  const { isPending } = mutation
  const onSubmit: SubmitHandler<ProfileSchemaType> = (data) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="text-4xl font-bold">My Profile</div>
      <hr />
      <div className=" flex items-center justify-between">
        <div className="text-2xl font-medium">
          Hi, I&apos;m {user.first_name} {user.last_name}
        </div>
        <Button
          className="rounded-full border bg-transparent text-gray-800 hover:bg-white"
          onClick={() => {
            setAllowEdit(true)
          }}
        >
          Edit your profile
        </Button>
      </div>
      <form className=" space-y-" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex gap-10">
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="first_name">
                First Name
              </label>
              <Input className="bg-transparent" disabled={!allowEdit} type="text" {...register("first_name")} />
              {errors.first_name && <span className="text-xs text-red-500">{errors.first_name.message}</span>}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="last_name">
                Last Name
              </label>
              <Input className="bg-transparent" disabled={!allowEdit} type="text" {...register("last_name")} />
              {errors.last_name && <span className="text-xs text-red-500">{errors.last_name.message}</span>}
            </div>
          </div>

          <div className="flex gap-10">
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="address">
                Address
              </label>
              <Input className="bg-transparent" disabled={!allowEdit} type="text" {...register("address")} />
              {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="phone">
                Phone number
              </label>
              <Input className="bg-transparent" disabled={!allowEdit} type="text" {...register("phone")} />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
            </div>
          </div>
          <div>
            <label className="font-medium text-gray-500" htmlFor="email">
              Email
            </label>
            <Input className="bg-transparent" disabled={!allowEdit} type="text" {...register("email")} />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="flex gap-10">
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="birth_date">
                Date of birth
              </label>
              <Input className="bg-transparent" disabled={!allowEdit} type="date" {...register("birth_date")} />
              {errors.birth_date && <span className="text-xs text-red-500">{errors.birth_date.message}</span>}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="font-medium text-gray-500" htmlFor="gender">
                Gender
              </label>
              <select
                className={`rounded-lg border bg-transparent p-[9px] ${!allowEdit ? "cursor-not-allowed text-gray-500" : ""}`}
                disabled={!allowEdit}
                {...register("gender")}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
            </div>
          </div>
        </div>
        <Button disabled={isPending || !allowEdit} className="mt-6" type="submit">
          {isPending ? <Spinner /> : "Save"}
        </Button>
      </form>
    </div>
  )
}
