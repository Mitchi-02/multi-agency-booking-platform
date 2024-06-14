"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiPlus } from "react-icons/fi"
import Link from "next/link"
import usePagination from "@/lib/hooks/usePagination"
import { paginateUsers } from "@/api/user"
import UsersList from "@/components/Users"

export default function ClientPage() {
  const { data, isLoading } = usePagination({
    fetchMethod: paginateUsers,
    queryKey: "users"
  })

  const UsersData = data.map((user) => {
    return {
      name: user.first_name + " " + user.last_name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      id: user.id,
      photo: user.profile_picture
    }
  })

  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-black leading-none tracking-tight">Users registred to TripX</h1>
          <h3 className="text-lg tracking-tight  text-gray-500">View all the current users details</h3>
        </div>
        <Link href={"/users/create"}>
          <Button size={"xl2"} variant={"primary"}>
            <FiPlus className="mr-1 h-6 w-6" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="flex-1 space-y-4 pb-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              {isLoading ? (
                <div className="p-10 text-center text-xl font-medium">Loading...</div>
              ) : (
                <UsersList data={UsersData} pageSize={10} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
