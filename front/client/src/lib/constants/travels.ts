import { DurationFilter } from "../types"
import ShieldIcon from "@/assets/icons/hikes-travels/shield.svg"
import Meal from "@/assets/icons/hikes-travels/meal.svg"
import Umbrella from "@/assets/icons/hikes-travels/umbrella.svg"
import Book from "@/assets/icons/hikes-travels/book.svg"
import Bus from "@/assets/icons/hikes-travels/bus.svg"
import Car from "@/assets/icons/hikes-travels/car.svg"
import Plane from "@/assets/icons/hikes-travels/plane.svg"
import Boat from "@/assets/icons/hikes-travels/boat.svg"
import Train from "@/assets/icons/hikes-travels/train.svg"
import { SVGProps } from "react"
import { CheckIcon } from "@radix-ui/react-icons"

export const DURATIONS: DurationFilter[] = [
  {
    id: "1",
    name: "less than 1 week",
    max_duration: "7"
  },
  {
    id: "2",
    name: "1-2 weeks",
    min_duration: "7",
    max_duration: "14"
  },
  {
    id: "3",
    name: "2-3 weeks",
    min_duration: "14",
    max_duration: "21"
  },
  {
    id: "4",
    name: "3-4 weeks",
    min_duration: "21",
    max_duration: "28"
  },
  {
    id: "5",
    name: "more than 4 weeks",
    min_duration: "28"
  }
]

export const SERVICES_ICONS = {
  documentation: Book,
  activities: Umbrella,
  food: Meal,
  transportation: Car,
  insurance: ShieldIcon,
  other: CheckIcon
} as Record<string, React.ComponentType<SVGProps<SVGElement>>>

export const TRANSPORT_ICONS = {
  bus: Bus,
  plane: Plane,
  train: Train,
  boat: Boat,
  other: CheckIcon
} as Record<string, React.ComponentType<SVGProps<SVGElement>>>



export const PLACES_LEFT_LIMIT = 10


export const BADGES_COLORS = [
  {
    text: "#FD9704",
    bg: "#E8DECF"
  },
  {
    text: "#38B245",
    bg: "#D5E1D6"
  },
  {
    text: "#0B3BA7",
    bg: "#EAEEFA"
  },
  {
    text: "#E96594",
    bg: "#FCEBF1"
  },
  {
    text: "#DC6E3D",
    bg: "#FBEEE8"
  }
]

export const AGENCY_CARD_OVERLAYS = ["#FF543D80", "#DC6E3D60", "#E9659490", "#0B3BA760"]