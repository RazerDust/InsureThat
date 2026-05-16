import { Button, PasswordInput, Paper, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconLogin2 } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextField } from '../../../components/forms/TextField'
import type { LoginRequest } from '../types'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    notifications.show({
      color: 'teal',
      message: `Prepared sign-in for ${values.email}.`,
      title: 'Credentials validated',
    })
  })

  return (
    <Paper component="form" className="auth-form" withBorder onSubmit={onSubmit}>
      <Stack gap="md">
        <TextField
          label="Email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email', {
            validate: (value) =>
              loginSchema.shape.email.safeParse(value).success ||
              'Enter a valid email address',
          })}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          radius="md"
          error={errors.password?.message}
          {...register('password', {
            validate: (value) =>
              loginSchema.shape.password.safeParse(value).success ||
              'Enter at least 8 characters',
          })}
        />
        <Button
          leftSection={<IconLogin2 size={18} />}
          loading={isSubmitting}
          type="submit"
        >
          Sign in
        </Button>
      </Stack>
    </Paper>
  )
}
