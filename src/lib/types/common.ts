export type Optional<T> = T | undefined | null

export type AuditedContractsResponse = {
  totalAudits?: number
  audits?: Audit[]
}

export type Audit = {
  submission?: Submission
  report?: Report
}

export type Report = {
  ipfsHash?: string
  ipfsInfo?: IpfsInfo | null
  score?: number
  timestamp?: number
}

export type IpfsInfo = {
  auditReport?: AuditReport
}

export type AuditReport = {
  auditedFiles?: number
  vulnerabilityCount?: VulnerabilityCount
  totalLines?: number
  securityScore?: string
  vulnerabilities?: Vulnerability[]
  cost?: string
}

export type Vulnerability = {
  name?: string
  severity?: string
  snippet?: string
  lineNumbers?: number[]
  description?: string
  autoFixEnabled?: boolean
  confidence?: string
  recommendation?: string
  explanation?: string
  file?: string
  exists?: string
  cost?: string
  fingerprint?: string
}

export type VulnerabilityCount = {
  high?: number
  medium?: number
  low?: number
  informational?: number
  optimization?: number
}

export type Submission = {
  owner?: string
  contractAddress?: string
  proxyContract?: boolean
  timestamp?: number
  audited?: boolean
}
