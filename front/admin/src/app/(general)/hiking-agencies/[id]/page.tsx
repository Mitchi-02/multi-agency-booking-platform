"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ImageFormControl from "../../../../components/ui/custom/image-input"
import { Save, Trash2 } from "lucide-react"
import { UpdateHikeAgencySchema } from "@/lib/schemas/agency"
import { UpdateHikeAgencySchemaType } from "@/lib/types/agency"
import queryClient from "@/lib/queryClient"
import { deleteHikeAgency, getHikeAgencyDetails, updateHikeAgency } from "@/api/hike_agency"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ReadOnlyImage from "@/components/ui/custom/ReadOnlyImage"
import { CustomAxiosError } from "@/api/types"
import { HikeAgency } from "@/api/hike_agency/types"
import Loading from "@/components/ui/custom/Loading"
import { useEffect } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

export default function UpdateHikeAgencyPage() {
  const router = useRouter()
  const id = useParams<{ id: string }>().id

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<UpdateHikeAgencySchemaType>({
    resolver: zodResolver(UpdateHikeAgencySchema),
    defaultValues: {
      new_photos: [],
      deleted_photos: [],
      logo: ""
    }
  })

  const { error, data, isFetching } = useQuery<any, CustomAxiosError, HikeAgency>({
    queryKey: ["hikeAgencyDetails", id],
    queryFn: () => getHikeAgencyDetails(id)
  })

  const updateHikeAgencyMutation = useMutation({
    mutationFn: (updatedData: UpdateHikeAgencySchemaType) => updateHikeAgency(updatedData, id),
    onSuccess: async (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["hikeAgencyDetails", id]
      })
      router.push("/hiking-agencies")
      queryClient.invalidateQueries({
        queryKey: ["hike-agencies"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const onSubmit: SubmitHandler<UpdateHikeAgencySchemaType> = (data) => {
    updateHikeAgencyMutation.mutate(data)
  }

  const deleteAgencyMutation = useMutation({
    mutationFn: () => deleteHikeAgency(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["hikeAgencyDetails", id]
      })
      router.push("/hiking-agencies")
      queryClient.invalidateQueries({
        queryKey: ["hike-agencies"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const handleDelete = () => {
    deleteAgencyMutation.mutate()
  }

  useEffect(() => {
    if (!data) return

    setValue("name", data.name)
    setValue("description", data.description)
    setValue("contact_email", data.contact_email)
    setValue("phone", data.phone)
    setValue("address", data.address)
    setValue("logo", data.logo)
    setValue("social_media", data.social_media as Record<string, string>)
  }, [data])

  if (isFetching) return <Loading />
  if (error?.response?.status === 404 || !data) {
    router.push("/404")
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">Update this agency</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">
        Here you can update this agency infotmation then submit
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
            {[...watch("new_photos"), ...data.photos.filter((p) => !watch("deleted_photos").includes(p))]?.map(
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
        </div>
        <div className="col-span-3 mt-6 flex items-center justify-end gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} type="button">
                <Trash2 className="mr-1 h-6 w-6" />
                {deleteAgencyMutation.isPending ? <Spinner /> : "Delete agency"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-dm-sans">Agency Deletion</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete this agency ?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-error text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-800 text-white hover:bg-primary-blue"
                  disabled={deleteAgencyMutation.isPending}
                  onClick={handleDelete}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button disabled={updateHikeAgencyMutation.isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {updateHikeAgencyMutation.isPending ? <Spinner /> : "Update"}
          </Button>
        </div>
      </div>
    </form>
  )
}
