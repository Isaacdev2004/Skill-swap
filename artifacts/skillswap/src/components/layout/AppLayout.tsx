import * as React from "react"
import { Sidebar } from "./Sidebar"
import { useAuthStore } from "@/store/authStore"
import { Redirect } from "wouter"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col lg:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
