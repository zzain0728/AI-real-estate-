import Link from "next/link";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="font-semibold">Tenant Portal</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/tenant">
              Dashboard
            </Link>
            <Link className="hover:underline" href="/tenant/documents">
              Documents
            </Link>
            <Link className="hover:underline" href="/tenant/properties">
              Properties
            </Link>
            <Link className="hover:underline" href="/tenant/share">
              Share Profile
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
