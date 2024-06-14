import Link from "next/link"

interface CardProps {
  children: React.ReactNode
  header: string
  subtitle?: string
  backButton?: string
  backButtonLink?: string
  backText?: string
}

export const Card = ({ children, header, subtitle, backButton, backButtonLink, backText }: CardProps) => {
  return (
    // <div className="space-y-4 rounded-lg bg-white shadow-sm shadow-slate-400 w-1/2 px-52 py-20">
    <div className="w-1/2 space-y-4 rounded-lg bg-white px-52 py-20">
      <div>
        <div className="mb-2 text-center text-3xl font-semibold">{header}</div>
        <div className="mb-10 text-center text-sm text-gray-400">{subtitle}</div>
      </div>
      <div>{children}</div>
      {backButtonLink && (
        <div className="text-center text-sm">
          <span>{backText}</span>&nbsp;
          <Link className="text-primary_color hover:underline" href={backButtonLink}>
            {backButton}
          </Link>
        </div>
      )}
    </div>
  )
}
