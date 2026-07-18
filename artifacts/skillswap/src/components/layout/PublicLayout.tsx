import * as React from "react"

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      {children}
    </div>
  )
}
