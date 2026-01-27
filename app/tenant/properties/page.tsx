"use client";

import { Badge, Button, Card, H1, Input, Muted, type BadgeTone } from "@/components/ui";
import { mockTenant } from "@/lib/mock";
import type { PropertyStatus } from "@/lib/types";
import { useMemo, useState } from "react";

export default function TenantProperties() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    return mockTenant.properties.filter((p) => p.address.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const statusTone = (s: PropertyStatus): BadgeTone => {
    if (s === "Rejected") return "red";
    if (s === "Accepted") return "green";
    if (s === "Under Review") return "yellow";
    return "blue";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <H1>Properties</H1>
          <Muted>Track requests, viewings, applications, and outcomes.</Muted>
        </div>
        <Button variant="secondary">Request Viewing (later)</Button>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search address..." />
          <Button variant="ghost" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Address</th>
                <th className="py-2">Rent</th>
                <th className="py-2">Status</th>
                <th className="py-2">Dates</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.address}</td>
                  <td className="py-2">${p.rent.toLocaleString()}</td>
                  <td className="py-2">
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  </td>
                  <td className="py-2 text-neutral-700">
                    <div>Req: {p.dateRequested ?? "-"}</div>
                    <div>Viewed: {p.dateViewed ?? "-"}</div>
                    <div>Applied: {p.dateApplied ?? "-"}</div>
                    <div className="text-xs text-neutral-500">Last: {p.lastUpdate}</div>
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
