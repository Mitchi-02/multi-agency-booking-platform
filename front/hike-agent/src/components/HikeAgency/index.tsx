"use client"

import { getSession } from "@/actions/getSession"
import { updateSession } from "@/actions/updateSession"
import { updateHikeAgency } from "@/api/agency"
import { IAgency } from "@/api/auth/types"
import { UpdateHikeAgencySchema } from "@/lib/schemas/agency"
import { UpdateHikeAgencySchemaType } from "@/lib/types/agency"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { DetailedHTMLProps, FormHTMLAttributes } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ImageFormControl from "../ui/custom/image-input"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import ReadOnlyImage from "../ui/custom/ReadOnlyImage"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { Spinner } from "../ui/spinner"

interface HikeAgencyProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  agency: IAgency
}

export default function HikeAgency({ agency, className, ...rest }: HikeAgencyProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<UpdateHikeAgencySchemaType>({
    resolver: zodResolver(UpdateHikeAgencySchema),
    defaultValues: {
      ...agency,
      logo: agency.logo,
      new_photos: [],
      deleted_photos: []
    }
  })

  const updateHikeAgencyMutation = useMutation({
    mutationFn: (updatedData: UpdateHikeAgencySchemaType) => updateHikeAgency(updatedData),
    onSuccess: async (data) => {
      const { user, accessToken } = await getSession()
      await updateSession({ user: user, accessToken: accessToken, agency: data.data })
      toast.success(data.message)
      router.push("/profile")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const onSubmit: SubmitHandler<UpdateHikeAgencySchemaType> = (data) => {
    updateHikeAgencyMutation.mutate(data)
  }

  return (
    <form className={cn("", className)} onSubmit={handleSubmit(onSubmit)} {...rest}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">Hike Agency details</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">
        Here you can see and edit your agency information...
      </h2>
      <div className="my-6 grid grid-cols-3 justify-between gap-10 rounded-lg bg-[#FCFCFC] p-6">
        <div>
          <Label className={`${errors.name && "text-red-500"} text-sm font-semibold`}>Logo</Label>
          <ImageFormControl
            imageState={watch("logo")}
            label={"logo"}
            register={register("logo")}
            setValue={(s) =>
              setValue("logo", s, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
            error={errors.logo?.message || ""}
          />
        </div>
        <div>
          <Label className={`${errors.name && "text-red-500"} text-sm font-semibold`} htmlFor="name">
            Name
          </Label>
          <Input
            className={` ${errors.name && "border-red-500"}`}
            placeholder="Name..."
            id="name"
            {...register("name")}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col">
          <Label className={`${errors.description && "text-red-500"} text-sm font-semibold`} htmlFor="description">
            Description
          </Label>
          <Textarea
            className={`grow ${errors.description && "border-red-500"}`}
            placeholder="Description..."
            id="description"
            {...register("description")}
          />
          {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
        </div>
        <div>
          <Label className={`${errors.contact_email && "text-red-500"} text-sm font-semibold`} htmlFor="contact_email">
            Contact Email
          </Label>
          <Input
            className={` ${errors.contact_email && "border-red-500"}`}
            placeholder="Enter Your Email"
            id="contact_email"
            {...register("contact_email")}
          />
          {errors.contact_email && <span className="text-xs text-red-500">{errors.contact_email.message}</span>}
        </div>
        <div>
          <Label className={`${errors.phone && "text-red-500"} text-sm font-semibold`} htmlFor="phone">
            Phone
          </Label>
          <Input
            className={` ${errors.phone && "border-red-500"}`}
            placeholder="Enter Phone Number"
            id="phone"
            {...register("phone")}
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <div>
          <Label className={`${errors.address && "text-red-500"} text-sm font-semibold`} htmlFor="address">
            Address
          </Label>
          <Input
            className={` ${errors.address && "border-red-500"}`}
            placeholder="Enter Your Address"
            id="address"
            {...register("address")}
          />
          {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        </div>
        <div className="col-span-3 pt-10">
          <div className="flex items-center gap-8 pb-4">
            <h3 className="text-lg font-medium leading-none tracking-tight">Photos</h3>
            <div className="flex items-center gap-4">
              <Label
                htmlFor="photos"
                className="rounded-lg bg-primary-blue px-4 py-3 text-sm font-semibold text-white hover:bg-black"
                role="button"
              >
                Add photos
                <Input
                  type="file"
                  className="hidden"
                  multiple
                  id="photos"
                  onChange={(e) => {
                    if (!e.target.files) return
                    const files = []
                    for (let i = 0; i < e.target.files.length; i++) {
                      files.push(e.target.files[i])
                    }
                    setValue("new_photos", [...watch("new_photos"), ...files])
                  }}
                />
              </Label>
              {errors.new_photos && <span className="text-xs text-red-500">{errors.new_photos.message}</span>}
            </div>
          </div>
          <ul className="grid grid-cols-4 gap-4 pt-4">
            {[...watch("new_photos"), ...agency.photos.filter((p) => !watch("deleted_photos").includes(p))]?.map(
              (photo, i) => (
                <ReadOnlyImage
                  onDelete={() => {
                    if (typeof photo === "string") {
                      setValue("deleted_photos", [...watch("deleted_photos"), photo])
                    } else {
                      setValue(
                        "new_photos",
                        watch("new_photos").filter((p) => p.name !== photo.name)
                      )
                    }
                  }}
                  key={`photo-${i}`}
                  imageState={photo}
                />
              )
            )}
          </ul>
        </div>{" "}
        <div className="col-span-3 mt-6 flex items-center justify-end gap-4">
          <Button disabled={updateHikeAgencyMutation.isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {updateHikeAgencyMutation.isPending ? <Spinner /> : "Save"}
          </Button>
        </div>
      </div>
    </form>
  )
}
