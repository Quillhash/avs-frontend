import { cookies } from "next/headers"
import { NextResponse, NextRequest } from "next/server"
import { IRON_OPTIONS } from "@/lib/config/session"
import { getIronSession } from "iron-session"
import { publicClient } from "../../contract/client"
import abi from "../../contract/abi.json"
import {
  POLICY_STATUS,
  SERVICE_MANAGER_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { fetchIpfsData } from "@/lib/utils/getIpfsData"

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<{ nonce: string }>(
      await cookies(),
      IRON_OPTIONS
    )
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const url = request.nextUrl
    const wallet = url.searchParams.get("address")
    const recentOnly = Boolean(url.searchParams.get("recentOnly"))

    // Fetch audit data
    const audits: any = await publicClient.readContract({
      abi,
      address: SERVICE_MANAGER_CONTRACT_ADDRESS,
      functionName: "getUserSubmissions",
      args: [wallet],
    })

    const totalAudits = audits.length
    const auditNumbers = audits.map((audit: any) => Number(audit))
    auditNumbers.sort((a: number, b: number) => b - a)

    // Paginate audits
    const paginatedAudits = recentOnly ? auditNumbers.slice(0, 3) : auditNumbers

    // Fetch submissions for each paginated audit index
    const submissions = await Promise.all(
      paginatedAudits.map(async (index: any) => {
        const [submission, approvals, report, policies, claim] =
          await Promise.all([
            publicClient.readContract({
              abi,
              address: SERVICE_MANAGER_CONTRACT_ADDRESS,
              functionName: "getSubmission",
              args: [index],
            }),
            publicClient.readContract({
              abi,
              address: SERVICE_MANAGER_CONTRACT_ADDRESS,
              functionName: "getApprovalCount",
              args: [index],
            }),
            publicClient.readContract({
              abi,
              address: SERVICE_MANAGER_CONTRACT_ADDRESS,
              functionName: "auditReports",
              args: [index],
            }),
            publicClient.readContract({
              abi,
              address: SERVICE_MANAGER_CONTRACT_ADDRESS,
              functionName: "getPolicy",
              args: [index],
            }),
            publicClient.readContract({
              abi,
              address: SERVICE_MANAGER_CONTRACT_ADDRESS,
              functionName: "getClaim",
              args: [index],
            }),
          ])
        const formattedReport = {
          //@ts-expect-error
          ipfsHash: report[0],
          //@ts-expect-error
          ipfsInfo: report[0]
            ? //@ts-expect-error
              JSON.parse(Object.keys(await fetchIpfsData(report[0]))[0])
            : null,
          //@ts-expect-error
          score: report[1],
          //@ts-expect-error
          timestamp: report[2],
        }
        //@ts-expect-error
        if (policies.status) {
          //@ts-expect-error
          policies.statusText = POLICY_STATUS[policies.status]
        }
        return {
          submission,
          report: formattedReport,
          approvals: approvals || 0,
          policies,
          claim,
        }
      })
    )
    // Convert BigInt values in `submissions` to numbers
    const serializedSubmissions = submissions.map((submission) =>
      JSON.parse(
        JSON.stringify(submission, (key, value) =>
          typeof value === "bigint" ? Number(value) : value
        )
      )
    )

    return NextResponse.json({ totalAudits, audits: serializedSubmissions })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
