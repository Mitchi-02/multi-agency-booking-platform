import { Card } from "@/components/auth/Card"
import { LoginForm } from "@/components/auth/LoginForm"

const LoginPage = () => {
  return (
    <Card header="Welcome Back Travel Agent!" subtitle="Sign in to your account to continue.">
      <LoginForm />
    </Card>
  )
}
export default LoginPage
