import Card from "@/components/auth/Card"
import LoginForm from "@/components/auth/LoginForm"
import { Suspense } from "react"

function LoginPage() {
  return (
    <Card
      header="Welcome Back!"
      backText="Don't have an account ?"
      backButton="Sign up"
      backButtonLink="/signup"
      showSocialAuth={false}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </Card>
  )
}
export default LoginPage
