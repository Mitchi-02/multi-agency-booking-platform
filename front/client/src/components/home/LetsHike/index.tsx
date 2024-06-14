import first from "@/assets/images/home/lets-hike-images/first.png"
import second from "@/assets/images/home/lets-hike-images/second.png"
import third from "@/assets/images/home/lets-hike-images/third.png"
import fourth from "@/assets/images/home/lets-hike-images/fourth.png"

import HikeCard from "./HikeCard"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function LetsHike({ className, ...props }: Props) {
  const data = [
    {
      title: "Theniet Elhed",
      bgImage: first,
      nbReviews: 147,
      rating: 4.9,
      price: 2000,
      howFar: 1.2,
      address: "Theniet Elhed, Tisemsilet",
      duration: 1
    },
    {
      title: "Chrea",
      bgImage: second,
      nbReviews: 147,
      rating: 4.9,
      price: 2000,
      howFar: 1.2,
      address: "Chrea mountains, Blida",
      duration: 2
    },
    {
      title: "Taghit",
      bgImage: third,
      nbReviews: 147,
      rating: 4.9,
      price: 2000,
      howFar: 1.2,
      address: "Taghit Sahara, Bechar",
      duration: 3
    },
    {
      title: "Cap Figalo",
      bgImage: fourth,
      nbReviews: 147,
      rating: 4.9,
      price: 2000,
      howFar: 1.2,
      address: "Cap Figalo, Oran",
      duration: 4
    }
  ]
  return (
    <section className={cn("page-container page-container-xs", className)} {...props}>
      <h1 className="pb-4 text-5xl font-bold">The Premier Agencies in the Industry!</h1>
      <p className="pb-10 text-primary-gray">
        Our carefully curated list ensures you`ll receive nothing but the best. Explore now for an unforgettable
        journey!
      </p>

      <ul className="grid grid-cols-4 gap-3">
        {data.map((item) => (
          <li key={item.title}>
            <HikeCard
              title={item.title}
              bgImage={item.bgImage}
              nbReviews={item.nbReviews}
              rating={item.rating}
              price={item.price}
              howFar={item.howFar}
              address={item.address}
              duration={item.duration}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
