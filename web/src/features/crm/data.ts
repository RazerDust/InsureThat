// These TypeScript types describe the CRM data the UI expects.
// They also act as documentation for the matching C# DTOs in the backend.
export type CrmAccount = {
  id: string
  name: string
  entityType: string
  segment: string
  owner: string
  status: 'Active' | 'Review' | 'At risk'
  premium: number
  revenue: number
  renewalDate: string
  complianceScore: number
  risk: string
  aiSummary: string
  missingInfo: string[]
  contacts: CrmContact[]
  policies: CrmPolicy[]
  claims: CrmClaim[]
  tasks: CrmTask[]
  documents: CrmDocument[]
  activities: CrmActivity[]
}

export type CrmContact = {
  id: string
  name: string
  role: string
  email: string
  phone: string
  influence: 'Decision maker' | 'Approver' | 'Operational' | 'Finance'
}

export type CrmPolicy = {
  id: string
  product: string
  insurer: string
  number: string
  premium: number
  expiry: string
  status: 'Current' | 'Renewal' | 'Pending'
}

export type CrmClaim = {
  id: string
  type: string
  status: string
  nextAction: string
  reserve: number
}

export type CrmTask = {
  id: string
  title: string
  owner: string
  due: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'Blocked' | 'Done'
  relatedTo: string
}

export type CrmDocument = {
  id: string
  name: string
  type: string
  status: 'Classified' | 'Needs review' | 'Accepted'
  summary: string
}

export type CrmActivity = {
  id: string
  date: string
  title: string
  detail: string
  kind: 'Email' | 'Call' | 'AI' | 'Task' | 'Document'
}

// Local sample data keeps the CRM screen useful if the backend is not running.
export const crmAccounts: CrmAccount[] = [
  {
    id: 'harbour-fresh',
    name: 'Harbour Fresh Logistics',
    entityType: 'Company',
    segment: 'Transport and cold storage',
    owner: 'Mia Chen',
    status: 'Review',
    premium: 184500,
    revenue: 22140,
    renewalDate: '2026-06-22',
    complianceScore: 82,
    risk: 'Renewal market review needs updated vehicle schedule.',
    aiSummary:
      'Long-running transport client with property, fleet and liability cover. Premium increased after two refrigeration claims, but loss ratio has improved over the last six months.',
    missingInfo: ['Updated vehicle schedule', 'Driver declaration', 'Signed privacy notice'],
    contacts: [
      {
        id: 'nina',
        name: 'Nina Patel',
        role: 'Operations Director',
        email: 'nina@harbourfresh.example',
        phone: '+61 2 5550 1832',
        influence: 'Decision maker',
      },
      {
        id: 'owen',
        name: 'Owen Brooks',
        role: 'Finance Manager',
        email: 'owen@harbourfresh.example',
        phone: '+61 2 5550 1838',
        influence: 'Finance',
      },
    ],
    policies: [
      {
        id: 'fleet',
        product: 'Commercial Motor Fleet',
        insurer: 'Southern Cross Insurance',
        number: 'CMF-88291',
        premium: 126400,
        expiry: '2026-06-22',
        status: 'Renewal',
      },
      {
        id: 'liability',
        product: 'Public and Products Liability',
        insurer: 'Pacific Mutual',
        number: 'PPL-44528',
        premium: 58100,
        expiry: '2026-08-01',
        status: 'Current',
      },
    ],
    claims: [
      {
        id: 'claim-1',
        type: 'Spoilage',
        status: 'Awaiting assessor report',
        nextAction: 'Follow up insurer on Wednesday',
        reserve: 34000,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Request updated vehicle schedule',
        owner: 'Mia Chen',
        due: '2026-05-20',
        priority: 'High',
        status: 'Open',
        relatedTo: 'Fleet renewal',
      },
      {
        id: 'task-2',
        title: 'Check FSG acknowledgement',
        owner: 'Luca Bell',
        due: '2026-05-18',
        priority: 'Medium',
        status: 'Blocked',
        relatedTo: 'Compliance',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        name: '2025 Fleet Schedule.pdf',
        type: 'Schedule',
        status: 'Needs review',
        summary: 'AI detected 48 registered vehicles and 3 refrigeration trailers.',
      },
      {
        id: 'doc-2',
        name: 'Claims Run.xlsx',
        type: 'Claims history',
        status: 'Classified',
        summary: 'Two refrigeration losses and one windscreen claim in the policy period.',
      },
    ],
    activities: [
      {
        id: 'activity-1',
        date: 'Today',
        title: 'AI renewal brief generated',
        detail: 'Missing schedule and claims narrative added to the broker action list.',
        kind: 'AI',
      },
      {
        id: 'activity-2',
        date: 'Yesterday',
        title: 'Client call with Nina Patel',
        detail: 'Confirmed new Brisbane cold room starts operating in July.',
        kind: 'Call',
      },
      {
        id: 'activity-3',
        date: 'May 13',
        title: 'Fleet schedule uploaded',
        detail: 'Document Intelligence tagged vehicles, trailers and registration dates.',
        kind: 'Document',
      },
    ],
  },
  {
    id: 'civic-build',
    name: 'Civic Build Group',
    entityType: 'Company',
    segment: 'Construction',
    owner: 'Chris White',
    status: 'Active',
    premium: 248900,
    revenue: 29868,
    renewalDate: '2026-09-14',
    complianceScore: 94,
    risk: 'High value contractor with active contract works pipeline.',
    aiSummary:
      'Construction client with broad liability and contract works needs. Contact engagement is strong and compliance evidence is current.',
    missingInfo: ['Next quarter contract register'],
    contacts: [
      {
        id: 'amelia',
        name: 'Amelia Hart',
        role: 'Managing Director',
        email: 'amelia@civicbuild.example',
        phone: '+61 3 5551 2200',
        influence: 'Decision maker',
      },
      {
        id: 'sam',
        name: 'Sam Iqbal',
        role: 'Project Controls Lead',
        email: 'sam@civicbuild.example',
        phone: '+61 3 5551 2208',
        influence: 'Operational',
      },
    ],
    policies: [
      {
        id: 'contract-works',
        product: 'Contract Works',
        insurer: 'Harbour Underwriting',
        number: 'CW-90218',
        premium: 164300,
        expiry: '2026-09-14',
        status: 'Current',
      },
      {
        id: 'plant',
        product: 'Mobile Plant',
        insurer: 'Apex Insurance',
        number: 'MP-11820',
        premium: 84600,
        expiry: '2026-09-14',
        status: 'Current',
      },
    ],
    claims: [],
    tasks: [
      {
        id: 'task-3',
        title: 'Prepare contract works certificate',
        owner: 'Chris White',
        due: '2026-05-21',
        priority: 'Medium',
        status: 'Open',
        relatedTo: 'Certificate request',
      },
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'Terms of Engagement - signed.pdf',
        type: 'Compliance evidence',
        status: 'Accepted',
        summary: 'Client accepted current terms on 2026-04-02.',
      },
    ],
    activities: [
      {
        id: 'activity-4',
        date: 'May 15',
        title: 'Certificate request received',
        detail: 'Assistant agent drafted response and queued approval.',
        kind: 'Email',
      },
    ],
  },
  {
    id: 'northstar-medical',
    name: 'Northstar Medical Rooms',
    entityType: 'Partnership',
    segment: 'Healthcare',
    owner: 'Luca Bell',
    status: 'At risk',
    premium: 92750,
    revenue: 11130,
    renewalDate: '2026-06-03',
    complianceScore: 67,
    risk: 'Duplicate contact records and missing informed consent evidence.',
    aiSummary:
      'Healthcare practice with professional indemnity and business package cover. Compliance evidence is incomplete and renewal is inside the action window.',
    missingInfo: ['Informed consent evidence', 'Updated practitioner count', 'Duplicate contact merge'],
    contacts: [
      {
        id: 'dr-lee',
        name: 'Dr Hannah Lee',
        role: 'Partner',
        email: 'hannah@northstarmedical.example',
        phone: '+61 7 5552 3004',
        influence: 'Approver',
      },
    ],
    policies: [
      {
        id: 'pi',
        product: 'Professional Indemnity',
        insurer: 'Guild Risk',
        number: 'PI-77104',
        premium: 92750,
        expiry: '2026-06-03',
        status: 'Renewal',
      },
    ],
    claims: [
      {
        id: 'claim-2',
        type: 'Professional indemnity notification',
        status: 'Open',
        nextAction: 'Broker to confirm clinical notes provided',
        reserve: 12000,
      },
    ],
    tasks: [
      {
        id: 'task-4',
        title: 'Merge duplicate Dr Lee contact',
        owner: 'Luca Bell',
        due: '2026-05-17',
        priority: 'High',
        status: 'Open',
        relatedTo: 'Duplicate detection',
      },
      {
        id: 'task-5',
        title: 'Send informed consent request',
        owner: 'Luca Bell',
        due: '2026-05-17',
        priority: 'High',
        status: 'Open',
        relatedTo: 'Compliance',
      },
    ],
    documents: [
      {
        id: 'doc-4',
        name: 'Practitioner Declaration.docx',
        type: 'Needs analysis',
        status: 'Needs review',
        summary: 'AI found a mismatch between declared practitioners and prior schedule.',
      },
    ],
    activities: [
      {
        id: 'activity-5',
        date: 'Today',
        title: 'Compliance gap detected',
        detail: 'Compliance Agent could not find informed consent acceptance evidence.',
        kind: 'AI',
      },
    ],
  },
]

// These colours are used anywhere an account status badge appears.
// Keeping them here stops the overview and detail pages drifting apart.
export const crmStatusColors = {
  Active: 'green',
  Review: 'yellow',
  'At risk': 'red',
} as const satisfies Record<CrmAccount['status'], string>

// Money formatting belongs in one helper so currency values stay consistent.
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    currency: 'AUD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
