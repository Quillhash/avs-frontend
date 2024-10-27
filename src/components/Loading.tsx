"use client"
import { CircularProgress } from "@nextui-org/react"

export const Loading = () => {
  return (
    <div className="flex h-[calc(100vh_-_64px)] items-center justify-center backdrop-blur-md">
      <CircularProgress size="lg" aria-label="Loading..." />
    </div>
  )
}

export default Loading
