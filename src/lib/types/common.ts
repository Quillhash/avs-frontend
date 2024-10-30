export type Optional<T> = T | undefined | null

export type AuditedContractsResponse = {
  totalAudits?: number
  audits?: Audit[]
}

export type Audit = {
  submission?: Submission
  report?: Report
  approvals?: number
  policies?: Policies
  claim?: Claim
}

export type Claim = {
  claimId?: number
  policyId?: number
  evidenceIPFSHash?: string
  timestamp?: number
  processed?: boolean
  approved?: boolean
}

export type Policies = {
  policyId?: number
  owner?: string
  submissionId?: number
  riskScore?: number
  coverageAmount?: number
  premiumAmount?: number
  startTime?: number
  endTime?: number
  status?: number
  statusText?: string
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
