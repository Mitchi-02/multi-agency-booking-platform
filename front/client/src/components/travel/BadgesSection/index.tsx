import { Badge } from "@/components/ui/badge"
import { BADGES_COLORS } from "@/lib/constants/travels"
import { cn } from "@/lib/utils"
import React, { DetailedHTMLProps } from "react"

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  experiences: string[]
}

export default function BadgesSection({ className, experiences, ...rest }: Props) {
  return (
    <ul className={cn("flex items-center gap-3 capitalize", className)} {...rest}>
      {experiences.map((e) => {
        const rand = Math.floor(Math.random() * BADGES_COLORS.length)
        return (
          <li key={e}>
            <Badge
              className="text-sm font-medium"
              style={{
                color: `${BADGES_COLORS[rand].text}`,
                backgroundColor: `${BADGES_COLORS[rand].bg}`
              }}
            >
              {e}
            </Badge>
          </li>
        )
      })}
    </ul>
  )
}
