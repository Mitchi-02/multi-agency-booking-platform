import australia from "@/assets/images/home/featured-images/australia.png"
import australia2 from "@/assets/images/home/featured-images/australia2.png"
import japan from "@/assets/images/home/featured-images/japan.png"
import japan2 from "@/assets/images/home/featured-images/japan2.png"
import barcelona from "@/assets/images/home/featured-images/barcelona.png"
import london from "@/assets/images/home/featured-images/london.png"

import FeaturedCard from "./FeaturedCard1"
import FeaturedCard3 from "./FeaturedCard3"
import FeaturedCard2 from "./FeaturedCard2"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export default function FeaturedDestinations({ className, ...props }: Props) {
  return (
    <section className={cn("page-container page-container-xs", className)} {...props}>
      <h1 className="pb-4 text-5xl font-bold">Featured Destinations</h1>
      <p className="pb-10 text-primary-gray">Popular destinations open to visitors from Algeria</p>
      <div className="flex w-full flex-row justify-between space-x-[3%]">
        <div className="flex w-[80%] flex-col justify-between">
          <FeaturedCard3 title="Barcelona Tour" background={barcelona} activities={196} rating={4.8} />
          <div className="flex w-full flex-row justify-between space-x-[5%]">
            <FeaturedCard2 title="London, UK" background={london} activities={122} rating={4.8} />
            <FeaturedCard2 title="Australia Tour" background={australia} activities={122} rating={4.8} />
          </div>
        </div>

        <div className="flex w-[25%] flex-col justify-between space-y-[10%]">
          <FeaturedCard title="Australia Tour" background={australia2} activities={122} rating={4.8} />
          <FeaturedCard title="Japan Tour" background={japan} activities={122} rating={4.8} />
          <FeaturedCard title="Japan Tour" background={japan2} activities={122} rating={4.8} />
        </div>
      </div>
    </section>
  )
}
