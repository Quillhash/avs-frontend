"use client"
import PieGraph from "@/components/PieChart"
import {
  SeverityColors,
  VulnerabilityCard,
} from "@/components/VulnerabilityCard"
import { cn } from "@nextui-org/react"
import Image from "next/image"
import { useParams } from "next/navigation"

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

export interface Vulnerabilities {
  high?: Vulnerability[]
  medium?: Vulnerability[]
  low?: Vulnerability[]
  informational?: Vulnerability[]
  optimization?: Vulnerability[]
}

export default function AuditedContract() {
  const { address } = useParams()
  const auditReport = getAuditReport()

  const Issues = [
    {
      category: "High Severity Issues",
      color: "bg-[#FF4D4D]",
      count: auditReport?.vulnerabilityCount?.high,
    },
    {
      category: "Medium Severity Issues",
      color: "bg-[#FFD166]",
      count: auditReport?.vulnerabilityCount?.medium,
    },
    {
      category: "Low Severity Issues",
      color: "bg-[#06D6A0]",
      count: auditReport?.vulnerabilityCount?.low,
    },
    {
      category: "Informational Issues",
      color: "bg-[#E568FF]",
      count: auditReport?.vulnerabilityCount?.informational,
    },
    {
      category: "Optimisation Issues",
      color: "bg-[#66E3F4]",
      count: auditReport?.vulnerabilityCount?.optimization,
    },
  ]

  const vulnerabilities = (auditReport?.vulnerabilities || [])?.reduce(
    (acc: Vulnerabilities, vulnerability: Vulnerability) => {
      if (vulnerability && vulnerability.severity) {
        const severity = vulnerability.severity as keyof Vulnerabilities
        acc[severity] = [...(acc[severity] || []), vulnerability]
      }
      return acc
    },
    {
      high: [],
      medium: [],
      low: [],
      informational: [],
      optimization: [],
    }
  )

  return (
    <div className="grid max-h-screen grid-rows-[32px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <div className="row-start-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          <span className="inline-block break-all bg-gradient-to-r from-warning to-danger bg-clip-text font-mono text-transparent">
            {address}
          </span>
        </div>
      </div>

      <div className="row-start-2 max-w-4xl max-md:max-w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 max-md:flex-col">
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-primary-foreground/5 px-5 py-4">
              <h3 className="text-center text-xl font-semibold">Risk Score</h3>
              <div className="flex flex-row items-center justify-center gap-2">
                <Image
                  src={"/icons/security-score.svg"}
                  width={32}
                  height={32}
                  alt={"Risk Score"}
                />
                <h4 className="text-3xl font-bold">
                  {auditReport?.securityScore}%
                </h4>
              </div>
            </div>

            <div className="rounded-xl bg-primary-foreground/5 px-5 py-4">
              <div className="mb-2 text-xl font-semibold">Audit Summary:</div>
              <div className="text-justify text-sm">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Doloremque temporibus autem velit! Voluptatum natus non
                eligendi, totam culpa minus deserunt asperiores quaerat
                voluptatibus soluta exercitationem, alias maxime doloribus ipsum
                laborum quibusdam excepturi veritatis quas cupiditate veniam
                nisi fugit autem nobis! Eum pariatur aliquam amet non atque
                minus, quos quam laboriosam.
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-xl bg-primary-foreground/5 px-5 py-4">
            <h3 className="text-xl font-semibold">
              Issues Count based on Severity Level:
            </h3>
            <div className="md: grid grid-cols-1 gap-4 pt-8 md:grid-cols-2 md:gap-1">
              <ul className="flex flex-col gap-4">
                {Issues.map((issue, i) => {
                  return (
                    <li key={i}>
                      <div className="flex flex-row items-center justify-start gap-2.5 text-sm">
                        <div
                          className={`h-3 w-3 rounded-sm ${issue.color}`}
                        ></div>
                        <h4 className="w-48 font-semibold">{issue.category}</h4>
                        {"-"}
                        <h5 className="font-extrabold">{issue.count || 0}</h5>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="flex items-start justify-center md:justify-start">
                <PieGraph
                  data={Issues}
                  label="Total"
                  total={totalIssueCount(Issues)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-primary-foreground/5 px-5 py-4">
            <h3 className="text-xl font-semibold">Vulnerabilities:</h3>

            <div className="mt-4 flex flex-col gap-4">
              {auditReport?.vulnerabilities?.length ? (
                Object.keys(vulnerabilities).map((severity) => {
                  const issues =
                    vulnerabilities[severity as keyof Vulnerabilities]
                  if (!issues?.length) return null
                  return (
                    <div key={severity} className="flex flex-col gap-2">
                      <h4
                        className={cn(
                          "text-lg font-semibold capitalize",
                          SeverityColors[
                            severity as keyof typeof SeverityColors
                          ]
                        )}
                        style={{
                          color:
                            SeverityColors[
                              severity as keyof typeof SeverityColors
                            ],
                        }}
                      >
                        {severity}
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {vulnerabilities[
                          severity as keyof Vulnerabilities
                        ]?.map((item: any, index: number) => (
                          <VulnerabilityCard
                            key={index}
                            item={item}
                            showCode={true}
                          />
                        ))}
                      </ul>
                    </div>
                  )
                })
              ) : (
                <div>No Vulnerabilities Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const totalIssueCount = (
  issues?: {
    category: string
    color: string
    hex?: string
    count: number | undefined
  }[]
) => {
  if (!issues) return 0
  let totalCount = 0

  for (const issue of issues) {
    if (issue.count !== undefined) {
      totalCount += issue.count
    }
  }

  return totalCount
}

// FIXME: remove this after testing
const getAuditReport = () => {
  const auditReport = {
    '{"auditReport":{"auditedFiles":1,"vulnerabilityCount":{"high":0,"medium":0,"low":2,"informational":0,"optimization":0},"totalLines":605,"securityScore":"99.49","vulnerabilities":[{"name":"Local Variables Being Shadowed","severity":"low","snippet":"function owner() public view returns (address) {\\r\\n    return _owner;\\r\\n  }","lineNumbers":[302,304],"description":"BEP20Token._approve(address,address,uint256).owner (BEP20Token.sol#587) shadows:\\n\\t- Ownable.owner() (BEP20Token.sol#302-304) (function)\\n","autoFixEnabled":true,"confidence":"high","recommendation":"To fix this issue, the function in the `Ownable` contract should be renamed to avoid the shadowing. For example, it could be renamed to `ownerAddress` to make it clear that it returns the address of the owner, and not the function that controls ownership.","explanation":"The reported issue is that the `owner` function in the `Ownable` contract of the `BEP20Token` contract shadows the `owner` function in the `BEP20Token` contract itself. This means that when the `owner` function is called within the `BEP20Token` contract, it may resolve to the `owner` function of the `Ownable` contract due to the function names being the same. This can lead to confusion and potentially incorrect behavior if not handled carefully.","file":"BEP20Token.sol","exists":"true","cost":"0.18","fingerprint":"2f4dbf542fa9f641d5ebaf6dc2883383b91b8444269246a10725b3591de0e43f"},{"name":"Local Variables Being Shadowed","severity":"low","snippet":"function owner() public view returns (address) {\\r\\n    return _owner;\\r\\n  }","lineNumbers":[302,304],"description":"BEP20Token.allowance(address,address).owner (BEP20Token.sol#424) shadows:\\n\\t- Ownable.owner() (BEP20Token.sol#302-304) (function)\\n","autoFixEnabled":true,"confidence":"high","recommendation":"To resolve this issue, you can either rename the \'owner\' function in the BEP20Token contract to something more specific, such as \'balanceOfOwner\', to avoid the shadowing, or you can ensure that the \'owner\' function in the Ownable contract is called explicitly when needed, using the \'super\' keyword in the derived contracts. If the \'owner\' function in the BEP20Token contract is not needed, it can be removed to prevent confusion.","explanation":"The issue reported is that the function \'owner\' in the BEP20Token contract is shadowing the \'owner\' function in the Ownable contract. This is a case of function name shadowing, where a function in a derived contract has the same name as a function in a base contract, potentially causing confusion and leading to unexpected behavior when the function is called. In this case, the \'owner\' function in the BEP20Token contract is not the same as the \'owner\' function in the Ownable contract, which is meant to return the address of the owner, not the owner\'s balance. However, since Solidity uses the most derived function when a function is called, it might lead to confusion if someone expects the \'owner\' function to return the token owner\'s address but instead gets the balance of the owner.","file":"BEP20Token.sol","exists":"true","cost":"0.18","fingerprint":"93e091e8f7691ce82c3abc5ade8c8d0a8b420c3382dfe42c767e5776eaaf2354"}],"cost":"0.02"}}':
      "",
  }

  try {
    return JSON.parse(Object.keys(auditReport)?.[0])?.auditReport as AuditReport
  } catch {
    return undefined
  }
}
