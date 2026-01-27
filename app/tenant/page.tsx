import { Badge, Button, Card, H1, H2, Muted, ProgressBar, type BadgeTone } from "@/components/ui";
import { mockTenant } from "@/lib/mock";
import type { ReadinessBadge } from "@/lib/types";

function getReadiness(): ReadinessBadge {
  const requiredMissing = mockTenant.docs.some((doc) => doc.required && !doc.uploaded);
  if (requiredMissing) return "Missing Required Documents";
  return "Application Ready";
}

function readinessTone(r: ReadinessBadge): BadgeTone {
  if (r === "Application Ready") return "green";
  if (r === "Agent Review Required") return "yellow";
  return "red";
}

export default function TenantDashboard() {
  const totalRequired = mockTenant.docs.filter((doc) => doc.required).length;
  const doneRequired = mockTenant.docs.filter((doc) => doc.required && doc.uploaded).length;
  const progress = Math.round((doneRequired / Math.max(1, totalRequired)) * 100);

  const readiness = getReadiness();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <H1>Welcome, {mockTenant.fullName}</H1>
          <Muted>Status: {mockTenant.tenantStatus}</Muted>
        </div>
        <div className="flex gap-2">
          <Button href="/tenant/documents" variant="secondary">
            Upload Documents
          </Button>
          <Button href="/tenant/properties">Track Properties</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <H2>Profile Completion</H2>
            <Badge tone={readinessTone(readiness)}>{readiness}</Badge>
          </div>
          <div className="mt-3 space-y-2">
            <ProgressBar value={progress} />
            <Muted>
              {doneRequired} / {totalRequired} required documents uploaded
            </Muted>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/tenant/documents" variant="secondary">
              Go to Documents
            </Button>
            <Button href="/tenant/share" variant="ghost">
              Generate Share Link
            </Button>
          </div>
        </Card>

        <Card>
          <H2>Quick Info</H2>
          <div className="mt-2 space-y-1 text-sm">
            <div>
              <span className="text-neutral-600">Move-in:</span> {mockTenant.requestedMoveIn}
            </div>
            <div>
              <span className="text-neutral-600">Occupation:</span> {mockTenant.occupation}
            </div>
            <div>
              <span className="text-neutral-600">Employer:</span> {mockTenant.employer}
            </div>
            <div>
              <span className="text-neutral-600">Immigration:</span> {mockTenant.immigrationStatus}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <H2>Property Tracking</H2>
        <Muted>Requested, viewed, and applied properties with statuses.</Muted>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Address</th>
                <th className="py-2">Rent</th>
                <th className="py-2">Status</th>
                <th className="py-2">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {mockTenant.properties.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.address}</td>
                  <td className="py-2">${p.rent.toLocaleString()}</td>
                  <td className="py-2">
                    <Badge tone={p.status === "Rejected" ? "red" : p.status === "Accepted" ? "green" : "blue"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-2">{p.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
