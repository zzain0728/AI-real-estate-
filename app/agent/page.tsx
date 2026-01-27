import { Badge, Button, Card, H1, H2, Muted } from "@/components/ui";
import { mockAgent, mockClients } from "@/lib/mock";

export default function AgentOverview() {
  const unlocked = mockClients.filter((c) => c.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <H1>Welcome, {mockAgent.fullName}</H1>
          <Muted>RECO: {mockAgent.recoLicense}</Muted>
        </div>
        <Badge tone={mockAgent.verified ? "green" : "yellow"}>
          {mockAgent.verified ? "Verified" : "Pending Verification"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <H2>Referral URL</H2>
          <Muted>Clients can sign up via your referral link.</Muted>
          <div className="mt-2 rounded-xl border bg-neutral-50 p-3 text-sm">{mockAgent.referralUrl}</div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" href="/agent/clients">
              Manage Clients
            </Button>
            <Button variant="ghost">Copy Link (later)</Button>
          </div>
        </Card>

        <Card>
          <H2>Quick Stats</H2>
          <div className="mt-2 space-y-1 text-sm">
            <div>
              <span className="text-neutral-600">Total clients:</span> {mockClients.length}
            </div>
            <div>
              <span className="text-neutral-600">Unlocked:</span> {unlocked}
            </div>
            <div>
              <span className="text-neutral-600">Locked:</span> {mockClients.length - unlocked}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
