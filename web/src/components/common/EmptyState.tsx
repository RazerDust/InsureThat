import { Paper, Text, Title } from '@mantine/core'

type EmptyStateProps = {
  message: string
  title: string
}

// EmptyState is shown when a page has no records to display.
// Reusing it keeps empty screens friendly and consistent across features.
export function EmptyState({ message, title }: EmptyStateProps) {
  return (
    <Paper className="empty-state" withBorder>
      <Title order={2}>{title}</Title>
      <Text c="dimmed">{message}</Text>
    </Paper>
  )
}
