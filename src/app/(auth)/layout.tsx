import { isAuthAction } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export default async function layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuth } = await isAuthAction()
  if (!isAuth) redirect("/")
  return <>{children}</>
}
