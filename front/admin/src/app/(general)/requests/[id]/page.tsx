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
import { UpdateRequestSchema } from "@/lib/schemas/agency"
import { UpdateRequestSchemaType } from "@/lib/types/agency"
import { deleteRequest, getRequestById, updateRequest } from "@/api/request"
import { CustomAxiosError } from "@/api/types"
import { AgencyRequest } from "@/api/request/types"
import { useEffect } from "react"
import { DateTime } from "luxon"
import queryClient from "@/lib/queryClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loading from "@/components/ui/custom/Loading"
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

export default function HikingAgencyDetails() {
  const router = useRouter()
  const searchParams = useParams()
  const agencyId = searchParams.id as string
  const { handleSubmit, setValue } = useForm<UpdateRequestSchemaType>({
    resolver: zodResolver(UpdateRequestSchema)
  })

  const { error, data, isFetching } = useQuery<any, CustomAxiosError, AgencyRequest>({
    queryKey: ["requestDetails", agencyId],
    queryFn: () => getRequestById(agencyId)
  })

  const updateRequestMutation = useMutation({
    mutationFn: (updatedData: UpdateRequestSchemaType) => updateRequest(updatedData, agencyId!),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["requestDetails", agencyId]
      })
      queryClient.invalidateQueries({
        queryKey: ["requests"]
      })
      router.push("/requests")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const deleteRequestMutation = useMutation({
    mutationFn: () => deleteRequest(agencyId!),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["requestDetails", agencyId]
      })
      queryClient.invalidateQueries({
        queryKey: ["requests"]
      })
      router.push("/requests")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    }
  })

  const handleDelete = () => {
    if (agencyId) {
      deleteRequestMutation.mutate()
    }
  }

  useEffect(() => {
    if (!data) return
    setValue("status", data.status)
  }, [data])

  const onSubmit: SubmitHandler<UpdateRequestSchemaType> = (formData) => {
    if (formData.status === data?.status) return
    updateRequestMutation.mutate(formData)
  }

  if (isFetching) return <Loading />
  if (error?.response?.status === 404 || !data) {
    router.push("/404")
    return null
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-8 lg:px-16">
      <h1 className="mx-12 mb-4 text-3xl font-black leading-none tracking-tight">Agency Request details</h1>
      <h2 className="mx-12 text-xl font-medium leading-none tracking-tight">
        Here you can see and edit status of this agency request...
      </h2>
      <div className="mx-12 my-6 flex justify-between gap-12 rounded-lg bg-[#FCFCFC] p-6">
        <div className="flex w-[80%] flex-col justify-between gap-4">
          <div>
            <label className={`text-sm font-semibold`} htmlFor="email">
              Email
            </label>
            <Input disabled id="email" value={data.email} />
          </div>
          <div>
            <label className={`text-sm font-semibold`} htmlFor="createdAt">
              Created at
            </label>
            <Input disabled id="createdAt" value={DateTime.fromISO(data.createdAt).toFormat("LLL dd yyyy")} />
          </div>
          <div>
            <label className={`text-sm font-semibold`} htmlFor="status">
              Status
            </label>
            <Select onValueChange={(v) => setValue("status", v)} value={data.status}>
              <SelectTrigger className="w-[180px] capitalize">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent id="status">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="refused">Refused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 flex items-center justify-end gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"} type="button">
                  <Trash2 className="mr-1 h-6 w-6" />
                  {deleteRequestMutation.isPending ? <Spinner /> : "Delete request"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-dm-sans">Request Deletion</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to delete this request ?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-error text-white">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-800 text-white hover:bg-primary-blue"
                    disabled={deleteRequestMutation.isPending}
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
      </div>
    </form>
  )
}
