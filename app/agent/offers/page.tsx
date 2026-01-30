"use client";

import { Badge, Button, Card, H1, H2, Input, Muted } from "@/components/ui";
import { getListingRequests, saveListingRequests } from "@/lib/requests";
import type { ListingRequest, OfferStage } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function Offers() {
  const [requests, setRequests] = useState<ListingRequest[]>([]);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.listingAddress.toLowerCase().includes(q) ||
        r.tenantName.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  }, [query, requests]);

  useEffect(() => {
    setRequests(getListingRequests());
    const onStorage = () => setRequests(getListingRequests());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateStage = (id: string, stage: OfferStage) => {
    setRequests((prev) => {
      const next = prev.map((req) => (req.id === id ? { ...req, stage } : req));
      saveListingRequests(next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <H1>Offer Requests</H1>
          <Muted>Tenants can request viewings or offers. Update offer stages as you work the file.</Muted>
        </div>
        <Button variant="secondary">Notification Settings (later)</Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search requests..." />
          <Button variant="ghost" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Type</th>
                <th className="py-2">Tenant</th>
                <th className="py-2">Listing</th>
                <th className="py-2">Offer / Move-in</th>
                <th className="py-2">Stage</th>
                <th className="py-2">Created</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">
                    <Badge tone={r.type === "Offer" ? "blue" : "yellow"}>{r.type}</Badge>
                  </td>
                  <td className="py-2">{r.tenantName}</td>
                  <td className="py-2">{r.listingAddress}</td>
                  <td className="py-2">
                    {r.type === "Offer" ? (
                      <div>
                        <div>${r.offerPrice?.toLocaleString() ?? "-"}</div>
                        <div className="text-xs text-neutral-500">{r.moveInDate ?? "-"}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs text-neutral-500">Preferred</div>
                        <div>{r.preferredViewingDate ?? "-"}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-2">
                    {r.type === "Offer" ? (
                      <select
                        className="rounded-xl border px-2 py-1 text-sm"
                        value={r.stage ?? "New"}
                        onChange={(e) => updateStage(r.id, e.target.value as OfferStage)}
                      >
                        <option value="New">New</option>
                        <option value="Drafting">Drafting</option>
                        <option value="Sent to Listing">Sent to Listing</option>
                        <option value="Countered">Countered</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <Badge tone="neutral">{r.status}</Badge>
                    )}
                  </td>
                  <td className="py-2">{r.createdAt}</td>
                  <td className="py-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const next = requests.filter((req) => req.id !== r.id);
                        saveListingRequests(next);
                        setRequests(next);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <H2>Offer Generator</H2>
        <Muted>Upload templates (OREA PDFs), auto-fill tenant/property data, generate final PDF and email body (later).</Muted>

        <div className="mt-3 flex flex-wrap gap-2">
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
