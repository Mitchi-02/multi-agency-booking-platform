import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function emptyParam<T extends Record<string, string | number | any[] | undefined>>(obj: T): T {
  for (const key in obj) {
    if (
      obj[key] === "" ||
      obj[key] === undefined ||
      //@ts-ignore
      (Array.isArray(obj[key]) && typeof obj[key] === "object" && obj[key]?.length === 0)
    ) {
      delete obj[key]
    }
  }
  return obj
}

export function calculatePrice(
  adults: number,
  kids: number,
  adult_price: number,
  kid_price: number,
  services?: number[]
) {
  const total = adults * adult_price + kids * kid_price
  return (
    services?.reduce((acc, service) => {
      return acc + service
    }, total) ?? total
  )
}

export function formatPrice(price: number, hideCurrency?: boolean) {
  const str = price <= 1000 ? price : price / 1000
  return `${str}${price !== 0 && price > 1000 ? "K" : ""} ${hideCurrency ? "" : "Da"}`
}

export function initBooking(n: number, services?: string[]) {
  return [...Array(n)].reduce((acc, _, index) => {
    acc[index] = {
      full_name: "",
      phone: "",
      chosen_services: services ?? []
    }
    return acc
  }, {})
}
