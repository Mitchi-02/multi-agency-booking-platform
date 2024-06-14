import bg1 from "@/assets/images/home/agencies-images/bg1.png"
import ag1 from "@/assets/images/home/agencies-images/ag1.png"
import ag2 from "@/assets/images/home/agencies-images/ag2.png"
import ag3 from "@/assets/images/home/agencies-images/ag3.png"
import ag4 from "@/assets/images/home/agencies-images/ag4.png"
import bg2 from "@/assets/images/home/agencies-images/bg2.png"
import bg3 from "@/assets/images/home/agencies-images/bg3.png"
import bg4 from "@/assets/images/home/agencies-images/bg4.png"

import AgencyCard from "./AgencyCard"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function TravelAgencies({ className, ...props }: Props) {
  const data = [
    {
      title: "SkyLink Travel",
      nbReviews: 122,
      rating: 4.8,
      background: bg1,
      logo: ag1
    },
    {
      title: "Bled Voyages",
      nbReviews: 122,
      rating: 4.8,
      background: bg2,
      logo: ag2
    },
    {
      title: "Nreservi",
      nbReviews: 122,
      rating: 4.8,
      background: bg3,
      logo: ag3
    },
    {
      title: "Planète Tours",
      nbReviews: 122,
      rating: 4.8,
      background: bg4,
      logo: ag4
    }
  ]
  return (
    <section className={cn("page-container page-container-xs", className)} {...props}>
      <h2 className="pb-4 text-5xl font-bold">The Premier Agencies in the Industry!</h2>
      <p className="pb-10 text-primary-gray">
        Our carefully curated list ensures you`ll receive nothing but the best. Explore now for an unforgettable
        journey!
      </p>

      <ul className="grid grid-cols-4 gap-10">
        {data.map((agency) => (
          <li key={agency.title}>
            <AgencyCard {...agency} />
          </li>
        ))}
      </ul>
    </section>
  )
}
