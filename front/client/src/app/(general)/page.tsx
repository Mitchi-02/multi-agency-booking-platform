import HeroSection from "@/components/global/HeroSection"
import DestinationsSection from "@/components/home/DestinationSection"
import FeaturedDestinations from "@/components/home/FeaturedDestinations"
import LetsHike from "@/components/home/LetsHike"
import TravelAgencies from "@/components/home/TravelAgencies"
import WeeklyPictures from "@/components/home/WeeklyPictures"


export default function Home() {
  return (
    <main className="font-dm-sans">
      <HeroSection />
      <DestinationsSection className="pb-32" />
      <TravelAgencies className="pb-32" />
      <FeaturedDestinations className="pb-32" />
      <LetsHike className="pb-32" />
      <WeeklyPictures className="pb-20"/>
    </main>
  )
}
