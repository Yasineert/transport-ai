import { PageHeader } from "@/components/page-header"

export default function ExamplePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{/* Page content goes here */}</main>
    </div>
  )
}

