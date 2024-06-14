import Link from "next/link"
import SocialMedia from "@/components/auth/Card/SocialMedia"

interface CardProps {
  children: React.ReactNode
  header: string
  backButton?: string
  backButtonLink?: string
  backText?: string
  showSocialAuth?: boolean
}

export default function Card({ children, header, backButton, backButtonLink, backText, showSocialAuth }: CardProps) {
  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-lg shadow-black ">
      <div className="text-center text-2xl font-semibold">{header}</div>
      {showSocialAuth && <SocialMedia />}
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
