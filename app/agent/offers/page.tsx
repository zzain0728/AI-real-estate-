import { Button, Card, H1, Muted } from "@/components/ui";

export default function Offers() {
  return (
    <div className="space-y-4">
      <H1>Offer Generator</H1>
      <Muted>Upload templates (OREA PDFs), auto-fill tenant/property data, generate final PDF and email body (later).</Muted>

      <Card>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Upload Template</Button>
          <Button variant="secondary">Pick Client</Button>
          <Button>Generate Draft</Button>
        </div>

        <div className="mt-4 rounded-xl border bg-neutral-50 p-3 text-sm">
          <div className="font-medium">Email Body (placeholder)</div>
          <div className="mt-2 text-neutral-700">
            Hello,
            <br />
            Please find the rental offer attached along with a secure link to the tenant's application documents.
            <br />
            Regards,
          </div>
        </div>
      </Card>
    </div>
  );
}
