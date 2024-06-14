import { StaticImageData } from "next/image"

interface CardProps {
  title: string
  background: StaticImageData
  address: string
  photographer: string
}

export default function PictureCard({ title, background, address, photographer }: CardProps) {
  const backgroundImage = `linear-gradient(to top, #0F0B2C99, #1F1F1F00, #02000E20), url(${background.src})`

  return (
    <article
      className="flex aspect-[370/495] flex-col items-start justify-between rounded-2xl p-8 transition duration-500 ease-in-out hover:scale-105"
      style={{ backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="rounded-[35px] bg-[#14141620] bg-opacity-20 px-5 py-2 text-xl font-medium text-white">
        {address}
      </div>
      <div>
        <h3 className="pb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-white">By {photographer}</p>
      </div>
    </article>
  )
}
