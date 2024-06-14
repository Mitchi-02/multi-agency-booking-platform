"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Save, Trash2 } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CustomAxiosError } from "@/api/types"
import queryClient from "@/lib/queryClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loading from "@/components/ui/custom/Loading"
import { TravelDetails, TravelFilters } from "@/api/travel/types"
import { deleteTravel, getFilters, getTravelDetails, updateTravel } from "@/api/travel"
import { UpdateTravelSchemaType } from "@/lib/types/travel"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ReadOnlyImage from "@/components/ui/custom/ReadOnlyImage"
import MultiSelectFilter from "@/components/ui/custom/MultiSelectFilter"
import PlanStep from "@/components/Travel/PlanStep"
import ComplementaryService from "@/components/Travel/ComplementaryService"
import { UpdateTravelSchema } from "@/lib/schemas/travel"
import { useEffect } from "react"
import { DateTime } from "luxon"
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

export default function UpdateTravelPage() {
  const id = useParams<{ id: string }>().id
  const router = useRouter()
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors }
  } = useForm<UpdateTravelSchemaType>({
    resolver: zodResolver(UpdateTravelSchema),
    defaultValues: {
      adult_price: 0,
      kid_price: 0,
      new_photos: [],
      deleted_photos: [],
      total_limit: 0,
      plan: [],
      complementary_services: []
    }
  })

  const {
    error: errorTravel,
    data: travel,
    isFetching: isFetchingTravel
  } = useQuery<any, CustomAxiosError, TravelDetails>({
    queryKey: ["travelDetails", id],
    queryFn: () => getTravelDetails(id)
  })

  const { error, data, isFetching } = useQuery<any, CustomAxiosError, TravelFilters>({
    queryKey: ["filters"],
    queryFn: () => getFilters()
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (d: UpdateTravelSchemaType) => updateTravel(d, id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["travelDetails", id]
      })
      router.push("/travels")
      queryClient.invalidateQueries({
        queryKey: ["travels"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const onSubmit: SubmitHandler<UpdateTravelSchemaType> = (data) => {
    mutate(data)
  }

  const deleteTravelMutation = useMutation({
    mutationFn: () => deleteTravel(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["travelDetails", id]
      })
      router.push("/travels")
      queryClient.invalidateQueries({
        queryKey: ["travels"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const handleDelete = () => {
    deleteTravelMutation.mutate()
  }

  useEffect(() => {
    if (!travel) return

    setValue("title", travel.title)
    setValue("description", travel.description)
    setValue("hotel", travel.hotel)
    setValue("destination", travel.destination)
    setValue(
      "departure_date",
      DateTime.fromISO(travel.departure_date).toFormat("yyyy-MM-dd") +
        "T" +
        DateTime.fromISO(travel.departure_date).toFormat("HH:mm")
    )
    setValue(
      "return_date",
      DateTime.fromISO(travel.return_date).toFormat("yyyy-MM-dd") +
        "T" +
        DateTime.fromISO(travel.return_date).toFormat("HH:mm")
    )
    setValue("departure_place", travel.departure_place)
    setValue("destination", travel.destination)
    setValue("adult_price", travel.adult_price)
    setValue("kid_price", travel.kid_price)
    setValue("total_limit", travel.total_limit)
    setValue("complementary_services", travel.complementary_services)
    setValue("plan", travel.plan)
    setValue("experiences", travel.experiences)
    setValue("region", travel.region)
    setValue("transportation_type", travel.transportation_type)
  }, [travel])

  if (isFetching || isFetchingTravel) return <Loading />
  if (error?.response?.status === 404 || !data || !travel || errorTravel?.response?.status === 404) {
    router.push("/404")
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">Update travel</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">
        Here you can view and update this travel with your destination and services
      </h2>
      <div className="my-6 grid grid-cols-3 justify-between gap-10 rounded-lg bg-[#FCFCFC] p-6">
        <div>
          <Label className={`${errors.title && "text-red-500"} text-sm font-semibold`} htmlFor="title">
            Title
          </Label>
          <Input
            className={` ${errors.title && "border-red-500"}`}
            placeholder="Title..."
            id="title"
            {...register("title")}
          />
          {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
        </div>
        <div>
          <Label className={`${errors.description && "text-red-500"} text-sm font-semibold`} htmlFor="description">
            Description
          </Label>
          <Textarea
            className={` ${errors.description && "border-red-500"}`}
            placeholder="Description..."
            id="description"
            {...register("description")}
          />
          {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
        </div>
        <div>
          <Label className={`${errors.hotel && "text-red-500"} text-sm font-semibold`} htmlFor="hotel">
            Hotel
          </Label>
          <Input
            className={` ${errors.hotel && "border-red-500"}`}
            placeholder="Hotel..."
            id="hotel"
            {...register("hotel")}
          />
          {errors.hotel && <span className="text-xs text-red-500">{errors.hotel.message}</span>}
        </div>
        <div>
          <Label className={`${errors.destination && "text-red-500"} text-sm font-semibold`} htmlFor="destination">
            Destination
          </Label>
          <Input
            className={` ${errors.destination && "border-red-500"}`}
            placeholder="Destination..."
            id="destination"
            {...register("destination")}
          />
          {errors.destination && <span className="text-xs text-red-500">{errors.destination.message}</span>}
        </div>
        <div>
          <Label
            className={`${errors.departure_place && "text-red-500"} text-sm font-semibold`}
            htmlFor="departure_place"
          >
            Departure place
          </Label>
          <Input
            className={` ${errors.departure_place && "border-red-500"}`}
            placeholder="Departure place..."
            id="departure_place"
            {...register("departure_place")}
          />
          {errors.departure_place && <span className="text-xs text-red-500">{errors.departure_place.message}</span>}
        </div>
        <div>
          <Label className={`${errors.adult_price && "text-red-500"} text-sm font-semibold`} htmlFor="adult_price">
            Adult price
          </Label>
          <Input
            className={` ${errors.adult_price && "border-red-500"}`}
            placeholder="Adult price..."
            id="adult_price"
            {...register("adult_price", {
              valueAsNumber: true
            })}
          />
          {errors.adult_price && <span className="text-xs text-red-500">{errors.adult_price.message}</span>}
        </div>
        <div>
          <Label className={`${errors.kid_price && "text-red-500"} text-sm font-semibold`} htmlFor="kid_price">
            Kid price
          </Label>
          <Input
            className={` ${errors.kid_price && "border-red-500"}`}
            placeholder="Kid price..."
            id="kid_price"
            {...register("kid_price", {
              valueAsNumber: true
            })}
          />
          {errors.kid_price && <span className="text-xs text-red-500">{errors.kid_price.message}</span>}
        </div>
        <div>
          <Label className={`${errors.total_limit && "text-red-500"} text-sm font-semibold`} htmlFor="total_limit">
            Total limit
          </Label>
          <Input
            className={` ${errors.total_limit && "border-red-500"}`}
            placeholder="Adult price..."
            id="total_limit"
            {...register("total_limit", {
              valueAsNumber: true
            })}
          />
          {errors.total_limit && <span className="text-xs text-red-500">{errors.total_limit.message}</span>}
        </div>
        <div>
          <Label
            className={`${errors.departure_date && "text-red-500"} text-sm font-semibold`}
            htmlFor="departure_date"
          >
            Departure date
          </Label>
          <Input
            type="datetime-local"
            className={` ${errors.departure_date && "border-red-500"}`}
            id="departure_date"
            {...register("departure_date")}
          />
          {errors.departure_date && <span className="text-xs text-red-500">{errors.departure_date.message}</span>}
        </div>
        <div>
          <Label className={`${errors.return_date && "text-red-500"} text-sm font-semibold`} htmlFor="return_date">
            Return date
          </Label>
          <Input
            type="datetime-local"
            className={` ${errors.return_date && "border-red-500"}`}
            id="return_date"
            {...register("return_date")}
          />
          {errors.return_date && <span className="text-xs text-red-500">{errors.return_date.message}</span>}
        </div>
        <div>
          <Label className={`${errors.region && "text-red-500"} text-sm font-semibold`} htmlFor="region">
            Region
          </Label>
          <Select onValueChange={(v) => setValue("region", v)} value={travel.region}>
            <SelectTrigger className={`${errors.region && "border-red-500"} w-full capitalize`}>
              <SelectValue placeholder="Region..." />
            </SelectTrigger>
            <SelectContent id="region">
              {data.regions.map((r) => (
                <SelectItem key={r.id} value={r.name} className="capitalize">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <span className="text-xs text-red-500">{errors.region.message}</span>}
        </div>
        <div>
          <Label
            className={`${errors.transportation_type && "text-red-500"} text-sm font-semibold`}
            htmlFor="transportation_type"
          >
            Transportation type
          </Label>
          <Select onValueChange={(v) => setValue("transportation_type", v)} value={travel.transportation_type}>
            <SelectTrigger className={`${errors.transportation_type && "border-red-500"} w-full capitalize`}>
              <SelectValue placeholder="Transportation type..." />
            </SelectTrigger>
            <SelectContent id="transportation_type">
              {data.transportation_types.map((r) => (
                <SelectItem key={r.id} value={r.name} className="capitalize">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.transportation_type && (
            <span className="text-xs text-red-500">{errors.transportation_type.message}</span>
          )}
        </div>
        <MultiSelectFilter
          accessor="name"
          data={data.travel_experiences}
          label="Travel experiences"
          isLoading={false}
          onUpdate={(d) => {
            setValue("experiences", d)
          }}
          durations={watch("experiences")}
        />
        <div className="col-span-2">
          <div className="flex items-center gap-8 pb-4">
            <h3 className="text-lg font-medium leading-none tracking-tight">Travel plan</h3>
            <div className="flex items-center gap-4">
              <Button
                className="rounded-lg bg-primary-blue px-4 py-3 text-sm font-semibold text-white"
                type="button"
                onClick={() => {
                  setValue("plan", [...watch("plan"), { title: "", description: "" }])
                }}
              >
                Add step
              </Button>
              {errors.plan && <span className="text-xs text-red-500">{errors.plan.message}</span>}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4 pt-4">
            {watch("plan").map((_, i) => (
              <PlanStep
                key={`plan-${i}`}
                onDelete={() => {
                  setValue(
                    "plan",
                    watch("plan").filter((_, j) => j !== i)
                  )
                }}
                index={i}
                title={watch(`plan`)[i].title}
                description={watch(`plan`)[i].description}
                onChangeTitle={(e) => {
                  setValue(
                    "plan",
                    watch("plan").map((p, j) => (j === i ? { ...p, title: e.target.value } : p))
                  )
                }}
                onChangeDescription={(e) => {
                  setValue(
                    "plan",
                    watch("plan").map((p, j) => (j === i ? { ...p, description: e.target.value } : p))
                  )
                }}
                titleError={errors.plan?.[i]?.title?.message}
                descriptionError={errors.plan?.[i]?.description?.message}
              />
            ))}
          </ul>
        </div>
        <div className="col-span-3">
          <div className="flex items-center gap-8 pb-4">
            <h3 className="text-lg font-medium leading-none tracking-tight">Complementary services</h3>
            <div className="flex items-center gap-4">
              <Button
                className="rounded-lg bg-primary-blue px-4 py-3 text-sm font-semibold text-white"
                type="button"
                onClick={() => {
                  setValue("complementary_services", [
                    ...watch("complementary_services"),
                    { name: "", price: 0, type: data.complementary_services_types[0].name }
                  ])
                }}
              >
                Add service
              </Button>
              {errors.complementary_services && (
                <span className="text-xs text-red-500">{errors.complementary_services.message}</span>
              )}
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-4 pt-4">
            {watch("complementary_services").map((_, i) => (
              <ComplementaryService
                key={`complementary_services-${i}`}
                onDelete={() => {
                  setValue(
                    "complementary_services",
                    watch("complementary_services").filter((_, j) => j !== i)
                  )
                }}
                index={i}
                name={watch(`complementary_services`)[i].name}
                price={watch(`complementary_services`)[i].price}
                type={watch(`complementary_services`)[i].type}
                onChangeName={(e) => {
                  setValue(
                    "complementary_services",
                    watch("complementary_services").map((p, j) => (j === i ? { ...p, name: e.target.value } : p))
                  )
                }}
                onChangePrice={(e) => {
                  setValue(
                    "complementary_services",
                    watch("complementary_services").map((p, j) =>
                      j === i ? { ...p, price: parseFloat(e.target.value) } : p
                    )
                  )
                }}
                onChangeType={(type) => {
                  setValue(
                    "complementary_services",
                    watch("complementary_services").map((p, j) => (j === i ? { ...p, type } : p))
                  )
                }}
                nameError={errors.complementary_services?.[i]?.name?.message}
                priceError={errors.complementary_services?.[i]?.price?.message}
                types={data.complementary_services_types.map((r) => r.name)}
              />
            ))}
          </ul>
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
            {[...watch("new_photos"), ...travel.photos.filter((p) => !watch("deleted_photos").includes(p))]?.map(
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
                {deleteTravelMutation.isPending ? <Spinner /> : "Delete trip"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-dm-sans">Trip Deletion</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete this trip ?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-error text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-800 text-white hover:bg-primary-blue"
                  disabled={deleteTravelMutation.isPending}
                  onClick={handleDelete}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button disabled={isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {isPending ? <Spinner /> : "Update"}
          </Button>
        </div>
      </div>
    </form>
  )
}
