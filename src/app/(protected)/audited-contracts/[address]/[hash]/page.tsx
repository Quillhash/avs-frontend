"use client"
import PieGraph from "@/components/PieChart"
import {
  SeverityColors,
  VulnerabilityCard,
} from "@/components/VulnerabilityCard"
import { IpfsInfo, Vulnerability } from "@/lib/types/common"
import { fetchIpfsData } from "@/lib/utils/getIpfsData"
import { cn, Skeleton, Spinner } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useParams } from "next/navigation"

export interface Vulnerabilities {
  high?: Vulnerability[]
  medium?: Vulnerability[]
  low?: Vulnerability[]
  informational?: Vulnerability[]
  optimization?: Vulnerability[]
}

export default function AuditedContract() {
  const { address, hash } = useParams()

  const { data, isLoading, error } = useQuery<IpfsInfo>({
    queryKey: ["audit-report", "ipfs", hash],
    queryFn: async () => {
      if (!hash) return null

      const data = JSON.parse(
        Object.keys(await fetchIpfsData(hash as string))[0]
      )
      return data
    },
    enabled: !!hash,
  })

  const Issues = [
    {
      category: "High Severity Issues",
      color: "bg-[#FF4D4D]",
      count: data?.auditReport?.vulnerabilityCount?.high,
    },
    {
      category: "Medium Severity Issues",
      color: "bg-[#FFD166]",
      count: data?.auditReport?.vulnerabilityCount?.medium,
    },
    {
      category: "Low Severity Issues",
      color: "bg-[#06D6A0]",
      count: data?.auditReport?.vulnerabilityCount?.low,
    },
    {
      category: "Informational Issues",
      color: "bg-[#E568FF]",
      count: data?.auditReport?.vulnerabilityCount?.informational,
    },
    {
      category: "Optimisation Issues",
      color: "bg-[#66E3F4]",
      count: data?.auditReport?.vulnerabilityCount?.optimization,
    },
  ]

  const vulnerabilities = (data?.auditReport?.vulnerabilities || [])?.reduce(
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

      {isLoading ? (
        <Spinner size="lg" color="warning" />
      ) : !data?.auditReport || error ? (
        <div className="text-center font-mono text-lg text-primary-foreground/50">
          No Audit Report Found
        </div>
      ) : (
        <div className="row-start-2 w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 max-md:flex-col">
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-primary-foreground/5 px-5 py-4">
                <h3 className="text-center text-xl font-semibold">
                  Risk Score
                </h3>
                <div className="flex flex-row items-center justify-center gap-2">
                  <Image
                    src={"/icons/security-score.svg"}
                    width={32}
                    height={32}
                    alt={"Risk Score"}
                  />
                  <h4 className="text-3xl font-bold">
                    {data?.auditReport?.securityScore}%
                  </h4>
                </div>
              </div>

              <div className="rounded-xl bg-primary-foreground/5 px-5 py-4">
                <div className="mb-2 text-xl font-semibold">Audit Summary:</div>
                <div className="text-justify text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Saepe, a praesentium exercitationem voluptate sapiente harum
                  tenetur, odit expedita maxime voluptas earum magnam veniam
                  beatae quam vel similique soluta. Deserunt, illum vitae. At
                  excepturi, aliquam distinctio dolore inventore eius. Cumque,
                  ipsa!
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-xl bg-primary-foreground/5 px-5 py-4">
              <h3 className="text-xl font-semibold">
                Issues Count based on Severity Level:
              </h3>
              <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
                <ul className="flex flex-col items-center gap-4">
                  {Issues.map((issue, i) => {
                    return (
                      <li key={i}>
                        <div className="flex flex-row flex-wrap items-center justify-start gap-2.5 text-sm">
                          <div
                            className={`h-3 w-3 rounded-sm ${issue.color}`}
                          ></div>
                          <h4 className="w-48 font-semibold">
                            {issue.category}
                          </h4>
                          {"-"}
                          <h5 className="font-extrabold">{issue.count || 0}</h5>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="flex items-center justify-center">
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
                {data?.auditReport?.vulnerabilities?.length ? (
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
                  <div className="text-center font-mono text-base text-primary-foreground/50">
                    No Vulnerabilities Found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
