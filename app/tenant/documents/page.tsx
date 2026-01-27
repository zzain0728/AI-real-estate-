"use client";

import { Badge, Button, Card, H1, Muted } from "@/components/ui";
import { mockTenant } from "@/lib/mock";
import { useState } from "react";

export default function TenantDocuments() {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>(
    Object.fromEntries(mockTenant.docs.map((doc) => [doc.type, doc.uploaded]))
  );

  return (
    <div className="space-y-4">
      <H1>Documents</H1>
      <Muted>Upload required documents. (Starter UI only - wire storage and extraction later.)</Muted>

      <div className="grid gap-4 md:grid-cols-2">
        {mockTenant.docs.map((doc) => {
          const isUp = uploaded[doc.type];
          return (
            <Card key={doc.type}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{doc.type}</div>
                  <Muted>{doc.required ? "Required" : "Optional"}</Muted>
                  {doc.note && <div className="mt-2 text-xs text-neutral-600">{doc.note}</div>}
                </div>

                <Badge tone={isUp ? "green" : doc.required ? "red" : "neutral"}>
                  {isUp ? "Uploaded" : "Not uploaded"}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium hover:bg-neutral-200">
                  <input
                    type="file"
                    className="hidden"
                    onChange={() => setUploaded((prev) => ({ ...prev, [doc.type]: true }))}
                  />
                  Choose File
                </label>
                <Button variant="ghost" onClick={() => setUploaded((prev) => ({ ...prev, [doc.type]: false }))}>
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="font-medium">Consent (UI placeholder)</div>
        <Muted>
          Before submission: consent to document storage, AI analysis, and sharing data with landlords and listing
          agents. Record timestamps in the database later.
        </Muted>
        <div className="mt-3 flex gap-2">
          <Button variant="secondary">Open Consent Modal (later)</Button>
          <Button>Save Consents (later)</Button>
        </div>
      </Card>
    </div>
  );
}
