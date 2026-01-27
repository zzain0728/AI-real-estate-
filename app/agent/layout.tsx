import Link from "next/link";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="font-semibold">Agent Dashboard</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/agent">
              Overview
            </Link>
            <Link className="hover:underline" href="/agent/clients">
              Clients
            </Link>
            <Link className="hover:underline" href="/agent/billing">
              Billing
            </Link>
            <Link className="hover:underline" href="/agent/offers">
              Offers
            </Link>
            <Link className="hover:underline" href="/">
              Public Site
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
