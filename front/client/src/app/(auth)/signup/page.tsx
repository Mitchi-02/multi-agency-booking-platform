import Card from "@/components/auth/Card"
import SignUpForm from "@/components/auth/SignUpForm"

function SignUpPage() {
  return (
    <Card
      showSocialAuth={false}
      header="Let's Go!"
      backText="Already have an account ?"
      backButton="Sign in"
      backButtonLink="/login"
    >
      <SignUpForm />
    </Card>
  )
}
export default SignUpPage
