import { PageHeader } from '../../../components/common/PageHeader'
import { LoginForm } from '../components/LoginForm'

// LoginPage is the screen wrapper; the actual fields live in LoginForm.
export function LoginPage() {
  return (
    <section className="page-stack">
      <PageHeader
        title="Sign in"
        description="Access the insurance operations workspace."
      />
      <LoginForm />
    </section>
  )
}
