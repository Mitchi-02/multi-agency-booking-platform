import { StaticImageData } from "next/image"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"

interface CardProps {
  title: string
  background: StaticImageData
  rating: number
  activities: number
}

export default function FeaturedCard2({ title, background, rating, activities }: CardProps) {
  const backgroundImage = `linear-gradient(to top, #1F1F1F99, #1F1F1F00), url(${background.src})`

  return (
    <article
      className="group relative flex w-full flex-col items-start justify-between space-y-48 rounded-2xl p-10 transition duration-500 ease-in-out hover:scale-105"
      style={{ backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="rounded-3xl bg-white px-5 text-center text-2xl font-bold text-orange-500 shadow-gray-500">
        {rating}
      </div>
      <div className="flex w-full flex-col space-y-4">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-3">
          <StarIcon className="text-[#FFC542]" />
          <p className="text-sm font-light text-white">{activities} Activities</p>
        </div>
      </div>
    </article>
  )
}
