import { TextInput, type TextInputProps } from '@mantine/core'

// TextField wraps Mantine's TextInput so common form styling lives in one place.
export function TextField(props: TextInputProps) {
  return <TextInput radius="md" {...props} />
}
