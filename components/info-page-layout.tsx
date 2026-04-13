import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

interface InfoPageLayoutProps {
  children: React.ReactNode
}

export function InfoPageLayout({ children }: InfoPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505]">
      <Header />
      <main className="flex-1 text-white">{children}</main>
      <Footer />
    </div>
  )
}
