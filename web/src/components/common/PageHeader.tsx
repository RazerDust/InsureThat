import { Group, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  actions?: ReactNode
  description?: string
  title: string
}

// PageHeader gives every page the same title, helper text, and optional action area.
export function PageHeader({ actions, description, title }: PageHeaderProps) {
  return (
    <Group className="page-header" justify="space-between" align="flex-start">
      <div>
        <Title order={1}>{title}</Title>
        {description ? <Text c="dimmed">{description}</Text> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </Group>
  )
}
