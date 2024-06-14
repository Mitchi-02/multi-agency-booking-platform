import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import travelImg from "/public/images/dashboard/travel.svg?url"
import hikeImg from "/public/images/dashboard/hike.svg?url"
import dinarImg from "/public/images/dashboard/dinardinar.svg?url"
import Link from "next/link"
import { Overview } from "@/components/Overview"
export default function Home() {
  return (
    <>
      <div className="flex-1 space-y-1">
        <h1 className="text-3xl font-black leading-none tracking-tight">Partnerships overview</h1>
        <h3 className="text-lg tracking-tight  text-gray-500">View your current partnerships & summary</h3>
      </div>
      <div className="flex-1 space-y-4 pb-8 pt-6">
        <div className="lg:grid-cols- grid gap-4 md:grid-cols-3">
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
              <Image src={dinarImg} alt="Dinar" width={24} height={24} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">DZD 521,827.13</div>
              <p className="text-muted-foreground text-xs">
                vs. 3 months prior to <b>16 Dec</b>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Travel Agencies</CardTitle>
              <Image src={travelImg} alt="Travel" width={24} height={24} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-muted-foreground text-xs">
                vs. 3 months prior to <b>16 Dec</b>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Hike Agencies</CardTitle>
              <Image src={hikeImg} alt="Hike" width={24} height={24} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-muted-foreground text-xs">
                vs. 3 months prior to <b>16 Dec</b>
              </p>
            </CardContent>
          </Card>
        </div>
        {/* SALES REPORT & CATEGORIES CIRCLED GRAPH */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Here should be a rounded graph.</CardDescription>
            </CardHeader>
            <CardContent>{/* <RecentSales /> */}</CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* LIST OF Latest Travel Agencies */}
          {/* EACH ROW: NAME, EMAIL, LOCATION, PHONE */}
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle>Latest Travel Agencies</CardTitle>
              <Link href={"/travel-agencies"}>
                <Button variant={"outline"}>View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="px-4">
              {/* LIST TRAVEL */}
              {/* <TravelAgencies pageSize={5} /> */}
            </CardContent>
          </Card>
          {/* LIST OF Latest Hike Agencies */}
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle>Latest Travel Agencies</CardTitle>
              <Link href={"/hiking-agencies"}>
                <Button variant={"outline"}>View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="px-4">
              {/* LIST HIKES */}
              {/* <HikeAgencies pageSize={5} /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
