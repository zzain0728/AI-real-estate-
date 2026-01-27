import { Button, Card, H1, Muted } from "@/components/ui";

export default function Billing() {
  return (
    <div className="space-y-4">
      <H1>Billing (Square)</H1>
      <Muted>
        Agents pay $50 per client for 3 months access. This is a placeholder screen for Square checkout and
        invoice/receipt automation.
      </Muted>

      <Card>
        <div className="font-medium">Unlock Client</div>
        <Muted>When payment succeeds, unlock: full profile, AI analysis, offer generation, document review, CSV export.</Muted>
        <div className="mt-3 flex gap-2">
          <Button>Start Square Checkout (later)</Button>
          <Button variant="secondary">View Invoices (later)</Button>
        </div>
      </Card>
    </div>
  );
}
