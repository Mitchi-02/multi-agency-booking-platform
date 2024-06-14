import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef } from "react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Spinner } from "@/components/ui/spinner"

interface SearchInputProps extends React.HTMLAttributes<HTMLElement> {
  label: string
  placeholder: string
  onSearch?: (s: string) => void
  value?: string
  id: string
  isLoading?: boolean
}

export default function SearchInput({
  label,
  placeholder,
  onSearch,
  value,
  id,
  isLoading,
  ...props
}: SearchInputProps) {
  const searchRef = useRef(value)

  useEffect(() => {
    searchRef.current = value
  }, [value])

  return (
    <section {...props}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label}
        <div className="mt-3 flex items-center space-x-2 rounded-lg border bg-white pr-3">
          <Input
            id={id}
            disabled={isLoading}
            className="flex-1 border-0 bg-transparent p-3 text-base text-primary-gray"
            placeholder={placeholder}
            defaultValue={value ?? ""}
            onChange={(e) => {
              searchRef.current = e.target.value
              onSearch?.(e.target.value)
            }}
          />
          {isLoading ? (
            <Spinner className="h-5 w-5 text-primary-gray" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-primary-gray" />
          )}
        </div>
      </Label>
    </section>
  )
}
