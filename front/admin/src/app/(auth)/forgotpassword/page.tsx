import { Card } from "@/components/auth/Card"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

const ForgotPasswordPage = () => {
  return (
    <Card header="Password Recovery" subtitle="Enter your email to recover your password">
      <ForgotPasswordForm />
    </Card>
  )
}
export default ForgotPasswordPage
