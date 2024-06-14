import { RouteType } from "./lib/types"

const routes: RouteType[] = [
  {
    name: "home",
    regex: "^/$"
  },
  {
    name: "profile",
    regex: "^/profile$"
  },
  {
    name: "travel bookings",
    regex: "^/profile/travels$"
  },
  {
    name: "hike bookings",
    regex: "^/profile/hikes$"
  },
  {
    name: "travel booking details",
    regex: "^/profile/travels\\/\\w+$"
  },
  {
    name: "hike booking details",
    regex: "^/profile/hikes\\/\\w+$"
  },
  {
    name: "travels list",
    regex: "^/travels$"
  },
  {
    name: "hikes list",
    regex: "^/hikes$"
  },
  {
    name: "travel details",
    regex: "^\\/travels\\/\\w+$"
  },
  {
    name: "hike details",
    regex: "^\\/hikes\\/\\w+$"
  },
  {
    name: "new booking",
    regex: "^\\/travels\\/\\w+\\/booking$"
  },
  {
    name: "new booking",
    regex: "^\\/hikes\\/\\w+\\/booking$"
  },
  {
    name: "Update booking",
    regex: "^\\/travels\\/\\w+\\/booking\\/\\w+$"
  },
  {
    name: "Update booking",
    regex: "^\\/hikes\\/\\w+\\/booking\\/\\w+$"
  },
  {
    name: "Confirm and pay",
    regex: "^\\/travels\\/\\w+\\/booking\\/\\w+\\/checkout$"
  },
  {
    name: "Confirm and pay",
    regex: "^\\/hikes\\/\\w+\\/booking\\/\\w+\\/checkout$"
  },
  {
    name: "Congratulations",
    regex: "^\\/travels\\/\\w+\\/booking\\/\\w+\\/checkout\\/thank-you$"
  },
  {
    name: "Congratulations",
    regex: "^\\/hikes\\/\\w+\\/booking\\/\\w+\\/checkout\\/thank-you$"
  }
]

export default routes
