"use client"
import { CircularProgress } from "@nextui-org/react"

export const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <CircularProgress size="lg" aria-label="Loading..." />
    </div>
  )
}

export default Loading
