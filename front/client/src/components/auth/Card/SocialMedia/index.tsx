import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"

export default function SocialMedia() {
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center gap-x-2">
        <Button size="lg" className="w-full" variant="outline">
          <FcGoogle className="h-5 w-5" />
        </Button>
        <Button size="lg" className="w-full" variant="outline">
          <FaFacebook className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center">
        <div className="h-0.5 flex-1 bg-gray-300"></div>
        <p className="mx-2 text-sm text-gray-500">Or continue with</p>
        <div className="h-0.5 flex-1 bg-gray-300"></div>
      </div>
    </div>
  )
}
