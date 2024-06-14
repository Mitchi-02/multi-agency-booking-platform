import Image, { StaticImageData } from "next/image"

interface CardProps {
  title: string
  nbDestinations: string
  picture: StaticImageData
}

export default function CityCard({ title, nbDestinations, picture }: CardProps) {
  return (
    <article className="flex flex-col items-start rounded-lg border border-input_bg p-6 transition-all duration-500 ease-in-out hover:border-white hover:bg-white hover:shadow-[0px_20px_52px_0px_#60606010]">
      <Image
        src={picture}
        alt={"photo of " + title}
        className="aspect-square w-[70px] rounded-xl object-cover"
        width={70}
        height={70}
      />
      <h3 className="pb-3 pt-4 text-xl font-bold">{title}</h3>
      <p className="text-sm font-medium text-primary-gray">{nbDestinations} Destinations</p>
    </article>
  )
}
