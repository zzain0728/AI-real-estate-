"use client";

import { Badge, Button, Card, H1, H2, Muted, Textarea, type BadgeTone } from "@/components/ui";
import { mockAI, mockTenant } from "@/lib/mock";
import { useState } from "react";

type Tab = "Profile" | "Documents" | "AI Analysis" | "Offers" | "Notes" | "Properties";

export default function ClientDetail() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [notes, setNotes] = useState("Strong profile. Missing one pay stub.");

  const tabs: Tab[] = ["Profile", "Documents", "AI Analysis", "Offers", "Notes", "Properties"];

  const riskTone: BadgeTone =
    mockAI.risk === "Green" ? "green" : mockAI.risk === "Yellow" ? "yellow" : "red";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <H1>{mockTenant.fullName}</H1>
          <Muted>Tenant status: {mockTenant.tenantStatus}</Muted>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Unlock Client ($50) (later)</Button>
          <Button variant="ghost">Export CSV (later)</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Button key={t} variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
        </div>
      </Card>

      {tab === "Profile" && (
        <Card>
          <H2>Profile</H2>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="text-neutral-600">Email:</span> {mockTenant.email}
            </div>
            <div>
              <span className="text-neutral-600">Phone:</span> {mockTenant.phone ?? "-"}
            </div>
            <div>
              <span className="text-neutral-600">DOB:</span> {mockTenant.dob}
            </div>
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
              <span className="text-neutral-600">Credit:</span> {mockTenant.creditScore ?? "-"}
            </div>
            <div>
              <span className="text-neutral-600">Income:</span>{" "}
              {mockTenant.annualIncome ? `$${mockTenant.annualIncome.toLocaleString()}` : "-"}
            </div>
            <div>
              <span className="text-neutral-600">Immigration:</span> {mockTenant.immigrationStatus}
            </div>
            <div>
              <span className="text-neutral-600">Co-app / Guarantor:</span>{" "}
              {mockTenant.coApplicantOrGuarantor ? "Yes" : "No"}
            </div>
          </div>
        </Card>
      )}

      {tab === "Documents" && (
        <Card>
          <H2>Documents</H2>
          <Muted>View and download docs. (Wire storage later.)</Muted>
          <div className="mt-3 space-y-2">
            {mockTenant.docs.map((doc) => (
              <div key={doc.type} className="flex items-center justify-between rounded-xl border bg-neutral-50 p-3 text-sm">
                <div>
                  <div className="font-medium">{doc.type}</div>
                  <div className="text-xs text-neutral-600">{doc.required ? "Required" : "Optional"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={doc.uploaded ? "green" : doc.required ? "red" : "neutral"}>
                    {doc.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                  <Button variant="secondary">Download (later)</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "AI Analysis" && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <H2>AI Analysis</H2>
            <Badge tone={riskTone}>Risk: {mockAI.risk}</Badge>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {mockAI.summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary">Override (later)</Button>
            <Button variant="ghost">Re-run Analysis (later)</Button>
          </div>
        </Card>
      )}

      {tab === "Offers" && (
        <Card>
          <H2>Offers</H2>
          <Muted>Upload OREA templates, auto-fill, generate PDF and email body (later).</Muted>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary">Upload Form Template (later)</Button>
            <Button>Generate Offer (later)</Button>
          </div>
        </Card>
      )}

      {tab === "Notes" && (
        <Card>
          <H2>Notes (Agent-only)</H2>
          <Muted>Auto-save and last edited timestamp (wire later).</Muted>
          <div className="mt-3 space-y-2">
            <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="text-xs text-neutral-500">Last edited: (mock) 2026-01-20 8:55 PM</div>
          </div>
        </Card>
      )}

      {tab === "Properties" && (
        <Card>
          <H2>Properties</H2>
          <Muted>Agent is the source of truth for final statuses.</Muted>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-600">
                <tr>
                  <th className="py-2">Address</th>
                  <th className="py-2">Rent</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Dates</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTenant.properties.map((p) => (
                  <tr key={p.id} className="border-t align-top">
                    <td className="py-2">{p.address}</td>
                    <td className="py-2">${p.rent.toLocaleString()}</td>
                    <td className="py-2">
                      <Badge tone={p.status === "Rejected" ? "red" : p.status === "Accepted" ? "green" : "blue"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-neutral-700">
                      <div>Req: {p.dateRequested ?? "-"}</div>
                      <div>Viewed: {p.dateViewed ?? "-"}</div>
                      <div>Applied: {p.dateApplied ?? "-"}</div>
                      <div className="text-xs text-neutral-500">Last: {p.lastUpdate}</div>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary">Confirm Viewed</Button>
                        <Button variant="secondary">Mark Applied</Button>
                        <Button variant="ghost">Set Status...</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
