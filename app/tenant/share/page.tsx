"use client";

import { Badge, Button, Card, H1, Input, Muted } from "@/components/ui";
import { mockAgent, mockTenant } from "@/lib/mock";
import { useMemo, useState } from "react";

export default function TenantShare() {
  const [days, setDays] = useState<7 | 14 | 30>(14);
  const [views] = useState(3);
  const [lastViewed] = useState("2026-01-20 9:14 PM");

  const shareId = "share_demo_123";
  const shareUrl = useMemo(() => `http://localhost:3000/share/${shareId}`, [shareId]);

  return (
    <div className="space-y-4">
      <H1>Shareable Profile</H1>
      <Muted>Password-protected summary page for landlords and listing agents (UI starter).</Muted>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-medium">Share Link</div>
            <Muted>Auto-generated when status is Active or beyond.</Muted>
          </div>
          <Badge tone="blue">Password = Agent first name (default)</Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Input readOnly value={shareUrl} />
          <Button variant="secondary" onClick={() => navigator.clipboard.writeText(shareUrl)}>
            Copy
          </Button>
          <Button variant="ghost">Revoke / Regenerate (later)</Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-neutral-50 p-3">
            <div className="text-xs text-neutral-600">Expires In</div>
            <div className="mt-1 flex gap-2">
              <Button variant={days === 7 ? "primary" : "secondary"} onClick={() => setDays(7)}>
                7
              </Button>
              <Button variant={days === 14 ? "primary" : "secondary"} onClick={() => setDays(14)}>
                14
              </Button>
              <Button variant={days === 30 ? "primary" : "secondary"} onClick={() => setDays(30)}>
                30
              </Button>
            </div>
            <div className="mt-2 text-sm">Configured: {days} days</div>
          </div>

          <div className="rounded-xl border bg-neutral-50 p-3">
            <div className="text-xs text-neutral-600">View Tracking (agent-only)</div>
            <div className="mt-1 text-sm">Total views: {views}</div>
            <div className="text-sm">Last viewed: {lastViewed}</div>
          </div>

          <div className="rounded-xl border bg-neutral-50 p-3">
            <div className="text-xs text-neutral-600">Defaults</div>
            <div className="mt-1 text-sm">Tenant: {mockTenant.fullName}</div>
            <div className="text-sm">Agent: {mockAgent.fullName}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
