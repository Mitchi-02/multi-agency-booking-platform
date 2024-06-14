import Image, { StaticImageData } from "next/image"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"

interface CardProps {
  title: string
  background: StaticImageData
  logo: StaticImageData
  rating: number
  nbReviews: number
}

export default function AgencyCard({ title, background, logo, rating, nbReviews }: CardProps) {
  const backgroundImage = `linear-gradient(to top, #1F1F1F99, #1F1F1F10), url(${background.src})`

  return (
    <article
      className="group flex aspect-[270/324] flex-col items-start justify-end rounded-2xl p-7 transition-all duration-500 ease-in-out hover:scale-105"
      style={{ backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Image
        src={logo}
        alt={"logo of " + title}
        className="max-w-[80%] self-center object-cover"
        width={166}
        height={110}
      />

      <h1 className="pt-2 font-poppins text-2xl font-semibold text-white pb-2">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-white">
        <StarIcon className="text-[#FFC542]" />
        <span>
          {rating} ({nbReviews} reviews)
        </span>
      </div>
    </article>
  )
}
