import { Button, Card, H1, Muted } from "@/components/ui";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <H1>Rental Application and Offer Automation</H1>
          <Muted>
            A simple portal for tenants to upload docs and track applications, and for agents to manage clients,
            generate offers, and share profiles securely.
          </Muted>

          <div className="mt-4 flex gap-3">
            <Button href="/login?role=tenant">Tenant Sign Up / Login</Button>
            <Button href="/login?role=agent" variant="secondary">
              Agent Sign Up / Login
            </Button>
            <Button href="/login" variant="ghost">
              Portal Login
            </Button>
          </div>
        </div>

        <Card className="w-full max-w-sm">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Explainer Video (placeholder)</div>
            <div className="aspect-video rounded-xl bg-neutral-100" />
            <Muted>Embed your video here later.</Muted>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Tenants</div>
          <Muted>Upload required documents, request viewings, apply to multiple properties, and track statuses.</Muted>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Agents</div>
          <Muted>Manage clients, run AI analysis, generate offers, share applications, and export CSV.</Muted>
        </Card>
      </div>
    </main>
  );
}
