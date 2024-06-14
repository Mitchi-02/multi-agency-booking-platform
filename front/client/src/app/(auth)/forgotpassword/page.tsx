import Card from "@/components/auth/Card"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"

function ForgotPasswordPage() {
  return (
    <Card header="Password Recovery" showSocialAuth={false}>
      <ForgotPasswordForm />
    </Card>
  )
}
export default ForgotPasswordPage
