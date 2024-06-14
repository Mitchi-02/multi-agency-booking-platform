import Image, { StaticImageData } from "next/image"
import StarIcon from "@/assets/icons/hikes-travels/star.svg"
import Calendar from "@/assets/icons/hikes-travels/calendar.svg"
import Location from "@/assets/icons/hikes-travels/location.svg"

interface CardProps {
  title: string
  bgImage: StaticImageData
  address: string
  duration: number
  price: number
  howFar: number
  rating: number
  nbReviews: number
}

export default function HikeCard({ title, bgImage, address, duration, price, howFar, rating, nbReviews }: CardProps) {
  return (
    <article className="rounded-2xl bg-white p-4 transition duration-500 ease-in-out hover:scale-105 hover:shadow-[0px_15px_45px_0px_#66666610]">
      <Image
        src={bgImage}
        alt="city"
        className="aspect-[242/152] w-full rounded-2xl object-cover"
        width={242}
        height={152}
      />
      <section className="flex items-center gap-3 pb-4 pt-5 text-sm font-medium">
        <StarIcon className="text-[#FFC542]" />
        <span>
          {rating} <span className="text-primary-gray">({nbReviews})</span>
        </span>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-medium">{title}</h3>
          <div className="rounded-md bg-primary-blue px-3 py-1 text-sm font-bold text-white">{price} Da</div>
        </div>
        <p className="pb-6 pt-1 text-sm font-medium text-primary-gray">{howFar} to Town Center</p>

        <div className="flex items-center gap-2">
          <Location className="text-light-gray" width={22} height={22} />
          <p className="text-sm text-primary-gray">{address}</p>
        </div>
        <div className="flex items-center gap-3 pt-3">
          <Calendar width={22} height={22} className="text-light-gray" />
          <p className="text-sm text-primary-gray">
            Duration: <span className="text-sm font-medium text-primary-gray">{duration} Days</span>
          </p>
        </div>
      </section>
    </article>
  )
}
