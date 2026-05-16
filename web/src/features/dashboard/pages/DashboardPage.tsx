import { Button } from '@mantine/core'
import {
  IconChartBar,
  IconClipboardCheck,
  IconFileAnalytics,
  IconPlus,
} from '@tabler/icons-react'
import { PageHeader } from '../../../components/common/PageHeader'
import { StatCard } from '../components/StatCard'

const metrics = [
  {
    label: 'Open quotes',
    value: '128',
    helper: 'Across all active brokers',
    tone: 'blue',
    icon: <IconFileAnalytics size={20} />,
  },
  {
    label: 'Bound policies',
    value: '42',
    helper: 'Issued this month',
    tone: 'green',
    icon: <IconClipboardCheck size={20} />,
  },
  {
    label: 'Review queue',
    value: '17',
    helper: 'Awaiting underwriting',
    tone: 'orange',
    icon: <IconChartBar size={20} />,
  },
] as const

export function DashboardPage() {
  return (
    <section className="page-stack">
      <PageHeader
        title="Dashboard"
        description="A live view of portfolio activity and operational queues."
        actions={<Button leftSection={<IconPlus size={18} />}>New quote</Button>}
      />
      <div className="dashboard-grid">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  )
}
