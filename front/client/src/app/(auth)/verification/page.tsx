import Card from "@/components/auth/Card"
import VerificationForm from "@/components/auth/VerificationForm"
import { Suspense } from "react"

function ForgotPasswordPage() {
  return (
    <div>
      <Card header="Email Verification" showSocialAuth={false}>
        <Suspense>
          <VerificationForm />
        </Suspense>
      </Card>
    </div>
  )
}
export default ForgotPasswordPage
