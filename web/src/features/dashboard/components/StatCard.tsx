import { Card, Group, Text, ThemeIcon } from '@mantine/core'
import type { ReactNode } from 'react'

type StatCardProps = {
  helper: string
  icon: ReactNode
  label: string
  tone: 'blue' | 'green' | 'orange'
  value: string
}

const toneColors: Record<StatCardProps['tone'], string> = {
  blue: 'blue',
  green: 'teal',
  orange: 'orange',
}

// StatCard is a reusable summary tile for dashboard-style numbers.
export function StatCard({ helper, icon, label, tone, value }: StatCardProps) {
  return (
    <Card className="stat-card" withBorder>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text className="stat-value">{value}</Text>
        </div>
        <ThemeIcon color={toneColors[tone]} radius="md" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
      <Text size="sm" c="dimmed">
        {helper}
      </Text>
    </Card>
  )
}
