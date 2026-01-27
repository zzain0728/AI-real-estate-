"use client";

import { Badge, Button, Card, H1, H2, Input, Muted } from "@/components/ui";
import { mockAgent, mockTenant } from "@/lib/mock";
import { useState } from "react";

export default function ShareableProfilePage() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);

  const expected = mockAgent.firstName.toLowerCase();

  if (!ok) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card>
          <H1>Tenant Profile (Secure)</H1>
          <Muted>Enter the password provided by the agent.</Muted>

          <div className="mt-4 flex gap-2">
            <Input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" />
            <Button onClick={() => setOk(pw.trim().toLowerCase() === expected)}>Unlock</Button>
          </div>

          <div className="mt-2 text-xs text-neutral-500">
            Starter UI note: this is client-side only (not real security yet).
          </div>
        </Card>
      </main>
    );
  }

  const age = Math.max(0, new Date().getFullYear() - new Date(mockTenant.dob).getFullYear());

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <H1>{mockTenant.fullName}</H1>
          <Muted>Shareable tenant summary</Muted>
        </div>
        <Badge tone="blue">Views tracked (agent-only)</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <H2>Overview</H2>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="text-neutral-600">Age:</span> {age}
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
              <span className="text-neutral-600">Credit score:</span> {mockTenant.creditScore ?? "-"}
            </div>
            <div>
              <span className="text-neutral-600">Salary:</span>{" "}
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
          {mockTenant.bio && (
            <div className="mt-3 rounded-xl border bg-neutral-50 p-3 text-sm">
              <div className="text-xs text-neutral-600">Message</div>
              <div>{mockTenant.bio}</div>
            </div>
          )}
        </Card>

        <Card>
          <H2>Documents</H2>
          <Muted>Links to PDFs would go here.</Muted>
          <div className="mt-3 space-y-2">
            {mockTenant.docs
              .filter((doc) => doc.required)
              .map((doc) => (
                <div key={doc.type} className="flex items-center justify-between text-sm">
                  <span>{doc.type}</span>
                  <Badge tone={doc.uploaded ? "green" : "red"}>{doc.uploaded ? "Ready" : "Missing"}</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Card>
        <H2>Properties Requested / Viewed / Applied</H2>
        <div className="mt-3 overflow-x-auto">
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
    </main>
  );
}
