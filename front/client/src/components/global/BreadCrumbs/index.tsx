"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { RouteType } from "@/lib/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, Fragment } from "react"

interface BreadcrumbsProps extends ComponentProps<typeof Breadcrumb> {
  routes: RouteType[]
}

export default function BreadCrumbs({ routes, className, ...props }: BreadcrumbsProps) {
  const path = usePathname()

  const paths = path
    .split("/")
    .filter(Boolean)
    .map(
      (_, index) =>
        `/${path
          .split("/")
          .filter(Boolean)
          .slice(0, index + 1)
          .join("/")}`
    )
  return (
    <Breadcrumb className={cn("font-dm-sans capitalize", className)} {...props}>
      <BreadcrumbList className="text-sm text-primary-black">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{routes.find((r) => new RegExp(r.regex).test("/"))?.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="stroke-primary-black" />
        {paths.map((p, index) => (
          <Fragment key={p}>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className={cn(index === paths.length - 1 ? "text-light-gray pointer-events-none" : "")}
              >
                <Link href={p}>{routes.find((r) => new RegExp(r.regex).test(p))?.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < paths.length - 1 && <BreadcrumbSeparator className="stroke-primary-black" />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
