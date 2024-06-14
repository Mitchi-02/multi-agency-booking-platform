import first from "@/assets/images/home/weekly/first.png"
import second from "@/assets/images/home/weekly/second.png"
import third from "@/assets/images/home/weekly/third.png"

import PictureCard from "./PictureCard"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function WeeklyPictures({ className, ...props }: Props) {
  const data = [
    {
      title: "Local Hikes",
      bgImage: first,
      address: "Chrea",
      user: "Ilyas Benhammadi"
    },
    {
      title: "Finland",
      bgImage: second,
      user: "Ilyas Benhammadi",
      address: "Helsinki"
    },
    {
      title: "Bali",
      bgImage: third,
      user: "Ilyas Benhammadi",
      address: "Indonesia"
    }
  ]
  return (
    <section className={cn("page-container page-container-xs", className)} {...props}>
      <h2 className="pb-4 text-5xl font-bold">Weekly Wanderlust</h2>
      <p className="max-w-[45rem] pb-10 text-primary-gray">
        Discover breathtaking moments captured by our travelers! Each week, we showcase three stunning photos from our
        proposed trips. Get inspired and join us on an unforgettable journey!
      </p>

      <ul className="grid grid-cols-3 gap-8">
        {data.map((item) => (
          <li key={item.title}>
            <PictureCard title={item.title} background={item.bgImage} photographer={item.user} address={item.address} />
          </li>
        ))}
      </ul>
    </section>
  )
}
