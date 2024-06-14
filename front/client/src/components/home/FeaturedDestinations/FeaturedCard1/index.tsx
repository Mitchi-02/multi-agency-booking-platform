import { StaticImageData } from "next/image"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"

interface CardProps {
  title: string
  background: StaticImageData
  rating: number
  activities: number
}

export default function FeaturedCard1({ title, background, rating, activities }: CardProps) {
  const backgroundImage = `linear-gradient(to top, #1F1F1F80, #1F1F1F00), url(${background.src})`

  return (
    <article
      className="group relative flex w-full flex-col items-start justify-between space-y-24 rounded-2xl p-6 transition duration-500 ease-in-out hover:scale-105"
      style={{ backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="rounded-3xl bg-white px-4 text-center text-xl font-bold text-orange-500 shadow-gray-500">
        {rating}
      </div>
      <div className="flex w-full flex-col space-y-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <StarIcon className="text-[#FFC542]" />
          <p className="text-xs font-light text-white">{activities} Activities</p>
        </div>
      </div>
    </article>
  )
}
