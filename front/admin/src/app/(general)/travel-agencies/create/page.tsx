"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ImageFormControl from "../../../../components/ui/custom/image-input"
import { Save } from "lucide-react"
import { AddHikingAgencySchema } from "@/lib/schemas/agency"
import { AddHikingAgencySchemaType } from "@/lib/types/agency"
import queryClient from "@/lib/queryClient"
import { createTravelAgency } from "@/api/travel_agency"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ReadOnlyImage from "@/components/ui/custom/ReadOnlyImage"

export default function CreateTravelAgencyPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<AddHikingAgencySchemaType>({
    resolver: zodResolver(AddHikingAgencySchema),
    defaultValues: {
      photos: [],
      logo: ""
    }
  })

  const createTravelAgencyMutation = useMutation({
    mutationFn: (updatedData: AddHikingAgencySchemaType) => createTravelAgency(updatedData),
    onSuccess: async (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["travel-agencies"]
      })
      router.push("/travel-agencies")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const onSubmit: SubmitHandler<AddHikingAgencySchemaType> = (data) => {
    createTravelAgencyMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">Create a new Travel Agency to TripX</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">Here you can create a new agency to TripX...</h2>
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
                    setValue("photos", [...watch("photos"), ...files])
                  }}
                />
              </Label>
              {errors.photos && <span className="text-xs text-red-500">{errors.photos.message}</span>}
            </div>
          </div>
          <ul className="grid grid-cols-4 gap-4 pt-4">
            {watch("photos").map((photo, i) => (
              <ReadOnlyImage
                onDelete={() => {
                  setValue(
                    "photos",
                    watch("photos").filter((_, j) => j !== i)
                  )
                }}
                key={`photo-${i}`}
                imageState={photo}
              />
            ))}
          </ul>
        </div>
        <div className="col-span-3 mt-6 flex items-center justify-end gap-4">
          <Button disabled={createTravelAgencyMutation.isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {createTravelAgencyMutation.isPending ? <Spinner /> : "Create"}
          </Button>
        </div>
      </div>
    </form>
  )
}
