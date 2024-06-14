"use client"

import { CustomAxiosError } from "@/api/types"
import { getSingleUser } from "@/api/user"
import { User } from "@/api/user/types"
import Loading from "@/components/ui/custom/Loading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Role } from "@/lib/schemas/user"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DefaultPP from "@/assets/images/default_pp.png"

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id
  const router = useRouter()

  const { isError, data, isLoading } = useQuery<any, CustomAxiosError, User>({
    queryFn: () => getSingleUser(id),
    queryKey: ["userDetails", id]
  })

  if (isLoading) return <Loading />
  if (isError || !data) {
    router.push("/404")
    return null
  }

  return (
    <form>
      <h1 className="mb-4 text-3xl font-black leading-none tracking-tight">User Details</h1>
      <h2 className="text-xl font-medium leading-none tracking-tight">Here you can view user details</h2>

      <div className="my-6 grid grid-cols-3 justify-between gap-10 rounded-lg bg-[#FCFCFC] p-6">
        <div>
          <Label className={`block pb-4 text-sm font-semibold`} htmlFor="profile_picture">
            Profile Picture
          </Label>
          <Image src={data?.profile_picture ?? DefaultPP} alt="Profile Picture" width={120} height={120} className="rounded-md" />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="first_name">
            First Name
          </Label>
          <Input placeholder="Enter your First Name" id="first_name" value={data.first_name} disabled />
        </div>

        <div>
          <Label className={`text-sm font-semibold`} htmlFor="last_name">
            Last Name
          </Label>
          <Input placeholder="Enter your Last Name" id="last_name" value={data.last_name} disabled />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="email">
            Email
          </Label>
          <Input placeholder="Enter your email" id="email" value={data.email} disabled />
        </div>

        <div>
          <Label className={`text-sm font-semibold`} htmlFor="phone">
            Phone
          </Label>
          <Input placeholder="Enter your Phone" id="phone" value={data.phone} disabled />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="address">
            Address
          </Label>
          <Input placeholder="Enter your Address" id="address" value={data.address} disabled />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="birth_date">
            Birth Date
          </Label>
          <Input placeholder="Enter your Birth Date" id="birth_date" value={data.birth_date} disabled />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="gender">
            Gender
          </Label>
          <Input placeholder="Enter your Gender" id="gender" value={data.gender} disabled />
        </div>
        <div>
          <Label className={`text-sm font-semibold`} htmlFor="role">
            Role
          </Label>
          <Input placeholder="Enter your Role" id="role" value={data.role} disabled />
        </div>
        {data.organization_id && (
          <div>
            <Label className={`text-sm font-semibold`} htmlFor="organization_id">
              Organization
            </Label>
            <Input placeholder="Enter your Organization" id="organization_id" value={data.organization_id} disabled />
            <Link
              href={`${data.role === Role.HIKE_AGENT ? "/hiking-agencies" : "/travel-agencies"}/${data.organization_id}`}
              className="block pt-4 font-medium text-primary-blue underline"
            >
              View Organization
            </Link>
          </div>
        )}
      </div>
    </form>
  )
}
