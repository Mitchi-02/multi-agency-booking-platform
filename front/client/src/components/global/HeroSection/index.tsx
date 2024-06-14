import Hero from "@/assets/images/home/hero.png"
import { cn } from "@/lib/utils"
import Image from "next/image"
import SearchForm from "../booking/SearchForm"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function HeroSection({ className, ...props }: HeroSectionProps) {
  return (
    <section className={cn("relative", className)} {...props}>
      <div className="relative">
        <Image src={Hero} alt="tripx hero section background" className="h-auto w-full" />
        <div className="page-container page-container-xs absolute inset-0 mx-auto flex items-center">
          <h1 className="max-w-[37.5rem] text-6xl font-bold leading-[1.5]">
            Explore with TripX: Your Passport to Adventure!
          </h1>
        </div>
      </div>
      <SearchForm className="-translate-y-1/2" />
    </section>
  )
}
