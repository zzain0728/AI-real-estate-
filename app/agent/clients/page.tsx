import Link from "next/link";

import { Badge, Card, H1, Input, Muted } from "@/components/ui";
import { mockClients } from "@/lib/mock";

export default function ClientsList() {
  return (
    <div className="space-y-4">
      <H1>Clients</H1>
      <Muted>List view with key columns from the PRD.</Muted>

      <Card>
        <div className="mb-3 flex items-center gap-3">
          <Input placeholder="Search (wire later)..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Full Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Credit</th>
                <th className="py-2">Income</th>
                <th className="py-2">Notes</th>
                <th className="py-2">Properties</th>
                <th className="py-2">Access</th>
              </tr>
            </thead>

            <tbody>
              {mockClients.map((c) => (
                <tr key={c.clientId} className="border-t align-top">
                  <td className="py-2">
                    <Link className="font-medium hover:underline" href={`/agent/clients/${c.clientId}`}>
                      {c.fullName}
                    </Link>
                  </td>
                  <td className="py-2">{c.status}</td>
                  <td className="py-2">{c.phone ?? "-"}</td>
                  <td className="py-2">{c.creditScore ?? "-"}</td>
                  <td className="py-2">
                    {c.combinedAnnualIncome ? `$${c.combinedAnnualIncome.toLocaleString()}` : "-"}
                  </td>
                  <td className="py-2 text-neutral-700" title={c.notesPreview}>
                    {c.notesPreview ?? "-"}
                  </td>
                  <td className="py-2">{c.propertiesSummary}</td>
                  <td className="py-2">
                    <Badge tone={c.unlocked ? "green" : "yellow"}>{c.unlocked ? "Unlocked" : "Locked ($50)"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
