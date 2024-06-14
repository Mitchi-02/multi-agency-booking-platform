import CityCard from "@/components/home/DestinationSection/CityCard"

import paris from "@/assets/images/home/city-little-images/paris.png"
import algiers from "@/assets/images/home/city-little-images/algiers.png"
import bali from "@/assets/images/home/city-little-images/bali.png"
import barcelona from "@/assets/images/home/city-little-images/barcelona.png"
import dubai from "@/assets/images/home/city-little-images/dubai.png"
import phuket from "@/assets/images/home/city-little-images/phuket.png"
import rome from "@/assets/images/home/city-little-images/rome.png"
import tokyo from "@/assets/images/home/city-little-images/tokyo.png"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function DestinationsSection({ className, ...props }: Props) {
  const data = [
    {
      title: "Tokyo, Japan",
      nbDestinations: "12",
      picture: tokyo
    },
    {
      title: "Paris, France",
      nbDestinations: "12",
      picture: paris
    },
    {
      title: "Algiers, Algeria",
      nbDestinations: "22",
      picture: algiers
    },
    {
      title: "Bali, Indonesia",
      nbDestinations: "12",
      picture: bali
    },
    {
      title: "Barcelona, Spain",
      nbDestinations: "12",
      picture: barcelona
    },
    {
      title: "Dubai, UAE",
      nbDestinations: "12",
      picture: dubai
    },
    {
      title: "Phuket, Thailand",
      nbDestinations: "12",
      picture: phuket
    },
    {
      title: "Rome, Italy",
      nbDestinations: "12",
      picture: rome
    }
  ]
  return (
    <section className={cn("page-container page-container-xs", className)} {...props}>
      <h2 className="pb-4 text-center text-5xl font-bold">Explore the World with Us</h2>
      <p className="mx-auto max-w-[57rem] pb-14 text-center text-primary-gray">
        From the bustling streets of Tokyo to the serene beaches of Bali, we offer a wide range of international travel
        experiences. Whether you`re a seasoned traveler or a first-time explorer, we have the perfect destination for
        you!
      </p>

      <ul className="grid grid-cols-4 gap-8">
        {data.map((city, index) => (
          <li key={city.title}>
            <CityCard key={index} title={city.title} nbDestinations={city.nbDestinations} picture={city.picture} />
          </li>
        ))}
      </ul>
    </section>
  )
}
