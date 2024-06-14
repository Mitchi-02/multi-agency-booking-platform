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
import { useEffect } from "react"
import { DateTime } from "luxon"
import queryClient from "@/lib/queryClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteBooking, getBookingById, updateBooking } from "@/api/booking"
import { BookingDetails } from "@/api/booking/types"
import { UpdateBookingSchemaType } from "@/lib/types/travel"
import { UpdateBookingSchema } from "@/lib/schemas/travel"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import Loading from "@/components/ui/custom/Loading"
import { Label } from "@/components/ui/label"
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
import { TravelReview } from "@/api/review/types"
import { getReview } from "@/api/review"
import Image from "next/image"
import DefaultPP from "@/assets/images/default_pp.png"

export default function BookingDetailsPage() {
  const router = useRouter()
  const searchParams = useParams()
  const bookingId = searchParams.id as string
  const { handleSubmit, setValue, watch } = useForm<UpdateBookingSchemaType>({
    resolver: zodResolver(UpdateBookingSchema)
  })

  const { error, data, isFetching } = useQuery<any, CustomAxiosError, BookingDetails>({
    queryKey: ["bookingDetails", bookingId],
    queryFn: () => getBookingById(bookingId)
  })

  const { data: review } = useQuery<any, CustomAxiosError, TravelReview>({
    queryKey: ["review", bookingId],
    queryFn: () => getReview(bookingId)
  })

  const updateRequestMutation = useMutation({
    mutationFn: (updatedData: UpdateBookingSchemaType) => updateBooking(updatedData, bookingId),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["bookingDetails", bookingId]
      })
      router.push("/bookings")
      queryClient.invalidateQueries({
        queryKey: ["bookings"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const deleteBookingMutation = useMutation({
    mutationFn: () => deleteBooking(bookingId!),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["bookingDetails", bookingId]
      })
      router.push("/bookings")
      queryClient.invalidateQueries({
        queryKey: ["bookings"]
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const handleDelete = () => {
    deleteBookingMutation.mutate()
  }

  const handleBookingStatusChange = (index: number, status: string) => {
    setValue(
      "bookers",
      watch("bookers").map((b, i) => {
        if (i === index) {
          return {
            ...b,
            status
          }
        } else {
          return b
        }
      })
    )
  }

  const handleDeleteBooker = (index: number) => {
    setValue(
      "bookers",
      watch("bookers").filter((_, i) => {
        if (i === index) {
          return false
        } else {
          return true
        }
      })
    )
  }

  useEffect(() => {
    if (!data) return
    setValue("paid", data.paid)
    setValue("method", data.method)
    setValue("bookers", data.booking_items)
  }, [data])

  const onSubmit: SubmitHandler<UpdateBookingSchemaType> = (formData) => {
    updateRequestMutation.mutate(formData)
  }

  if (isFetching) return <Loading />
  if (error?.response?.status === 404 || !data) {
    router.push("/404")
    return null
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">
        Booking Details of Travel{" "}
        <Link href={`/travels/${data.travel._id}`} className="text-primary-blue underline">
          {data.travel.destination}
        </Link>
      </h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">
        Here you can see and edit status of this booking...
      </h2>
      <div className="my-6 grid grid-cols-3 justify-between gap-10 rounded-lg bg-[#FCFCFC] p-6">
        <div className="flex items-center justify-start gap-2">
          <Image src={data.user.profile_picture ?? DefaultPP} width={40} height={40} alt="user" />
          <span className="text-sm font-medium capitalize">
            {data.user.first_name} {data.user.last_name}
          </span>
        </div>
        <div className="">
          <Label className={`text-sm font-semibold`} htmlFor="updatedAt">
            Last updated at
          </Label>
          <Input disabled id="updatedAt" value={DateTime.fromISO(data.updatedAt).toFormat("LLL dd yyyy")} />
        </div>
        <div className="flex items-center gap-10">
          <Label className={`text-sm font-semibold`} htmlFor="paid">
            Is Paid
          </Label>
          <Checkbox
            id="paid"
            checked={watch("paid")}
            onCheckedChange={(e) => {
              setValue("paid", !!e)
            }}
          />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="status">
            Payment method
          </Label>
          <Select onValueChange={(v) => setValue("method", v)} value={data.method}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent id="status">
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3 pt-10">
          <h3 className="pb-4 text-lg font-medium leading-none tracking-tight">Bookers List</h3>
          <ul className="grid grid-cols-3 gap-4">
            {watch("bookers")?.map((b, index) => (
              <li key={index} className="relative grid gap-4 rounded-lg border border-gray-300 p-4">
                <button
                  className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-error p-2 text-white"
                  onClick={() => handleDeleteBooker(index)}
                  type="button"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div>
                  <Label className={`text-sm font-semibold`}>Full name</Label>
                  <Input className="w-full" value={b.full_name} disabled />
                </div>
                <div>
                  <Label className={`text-sm font-semibold`}>Phone</Label>
                  <Input className="w-full" value={b.phone} disabled />
                </div>
                <div>
                  <Label className={`text-sm font-semibold`}>Price</Label>
                  <Input className="w-full" value={b.price} disabled />
                </div>
                <div>
                  <Label className={`text-sm font-semibold`}>Type</Label>
                  <Input className="w-full capitalize" value={b.type} disabled />
                </div>
                <div>
                  <Label className={`text-sm font-semibold`}>Chosen services</Label>
                  <Input className="w-full" value={b.chosen_services.join(", ") || "/"} disabled />
                </div>
                <div>
                  <Label className={`text-sm font-semibold`} htmlFor={`status${index}`}>
                    Status
                  </Label>
                  <Select onValueChange={(v) => handleBookingStatusChange(index, v)} value={b.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent id="status">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 mt-6 flex items-center justify-end gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} type="button">
                <Trash2 className="mr-1 h-6 w-6" />
                {deleteBookingMutation.isPending ? <Spinner /> : "Delete booking"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-dm-sans">Booking Cancelation</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to cancel this booking ?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-error text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-800 text-white hover:bg-primary-blue"
                  disabled={deleteBookingMutation.isPending}
                  onClick={handleDelete}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button disabled={updateRequestMutation.isPending} variant="primary" type="submit">
            <Save className="mr-1 h-6 w-6" />
            {updateRequestMutation.isPending ? <Spinner /> : "Save"}
          </Button>
        </div>
      </div>
      {review && (
        <div className="mb-6 grid grid-cols-2 justify-between gap-x-10 gap-y-6 rounded-lg bg-[#FCFCFC] p-6">
          <h3 className="col-span-2 text-lg font-medium leading-none tracking-tight">Booker Review</h3>
          <div className="">
            <label className={`text-sm font-semibold`} htmlFor="comment">
              Comment
            </label>
            <Input disabled id="comment" value={review.comment} />
          </div>
          <div className="">
            <label className={`text-sm font-semibold`} htmlFor="rating">
              Rating
            </label>
            <Input disabled id="rating" value={review.rating} />
          </div>
        </div>
      )}
    </form>
  )
}
