"use client";

import { Badge, Button, Card, H1, H2, Input, Muted } from "@/components/ui";
import { mockTenant } from "@/lib/mock";
import { getListingRequests, saveListingRequests } from "@/lib/requests";
import type { ListingRequest, OfferStage } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function Offers() {
  const [requests, setRequests] = useState<ListingRequest[]>([]);
  const [query, setQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [openChecksId, setOpenChecksId] = useState<string | null>(null);

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
    window.addEventListener("listing-requests-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("listing-requests-updated", onStorage);
    };
  }, []);

  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) ?? null;
  }, [requests, selectedRequestId]);

  const tenantProfile = useMemo(() => {
    if (!selectedRequest) return null;
    if (selectedRequest.tenantName === mockTenant.fullName) return mockTenant;
    return null;
  }, [selectedRequest]);

  const docSummary = useMemo(() => {
    if (!tenantProfile) return [];
    return tenantProfile.docs.map((doc) => ({
      label: doc.type,
      status: doc.uploaded ? "Uploaded" : "Missing",
      note: doc.note,
    }));
  }, [tenantProfile]);

  const buildChecks = (request: ListingRequest) => {
    const tenant = request.tenantName === mockTenant.fullName ? mockTenant : null;
    const creditScore = tenant?.creditScore ?? null;
    const afterTaxIncome = tenant?.annualIncome ?? null;
    const rent = request.offerPrice ?? 0;
    const hasCollections = false;

    const creditOk = creditScore !== null ? creditScore >= 700 : false;
    const incomeOk = afterTaxIncome !== null ? afterTaxIncome / 12 >= rent * 2 : false;
    const collectionsOk = !hasCollections;

    return {
      creditScore,
      afterTaxIncome,
      rent,
      creditOk,
      incomeOk,
      collectionsOk,
    };
  };

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
              {rows.map((r) => {
                const checks = buildChecks(r);
                const open = openChecksId === r.id;
                return (
                  <>
                    <tr key={r.id} className="border-t">
                      <td className="py-2">
                        <Badge tone={r.type === "Offer" ? "blue" : "yellow"}>{r.type}</Badge>
                      </td>
                      <td className="py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{r.tenantName}</span>
                          <Button
                            variant="ghost"
                            onClick={() => setOpenChecksId(open ? null : r.id)}
                          >
                            {open ? "Hide Credit Checks" : "View Credit Checks"}
                          </Button>
                        </div>
                      </td>
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
                            value={r.stage ?? "Submitted"}
                            onChange={(e) => updateStage(r.id, e.target.value as OfferStage)}
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="In Review">In Review</option>
                            <option value="Submitted to Landlord">Submitted to Landlord</option>
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
                          onClick={() => setSelectedRequestId(r.id)}
                        >
                          Submit to Landlord
                        </Button>
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
                    {open ? (
                      <tr className="border-t">
                        <td className="py-3" colSpan={7}>
                          <div className="rounded-2xl border bg-neutral-50 p-4 text-sm">
                            <div className="text-sm font-medium">Tenant Credit Checks (Mock)</div>
                            <div className="mt-2 grid gap-2 text-neutral-700">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>Credit score: {checks.creditScore ?? "N/A"}</div>
                                <Badge tone={checks.creditOk ? "green" : "red"}>{checks.creditOk ? "Yes" : "No"}</Badge>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  After-tax income:{" "}
                                  {checks.afterTaxIncome !== null ? `$${checks.afterTaxIncome.toLocaleString()}` : "N/A"}
                                </div>
                                <Badge tone={checks.incomeOk ? "green" : "red"}>{checks.incomeOk ? "Yes" : "No"}</Badge>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>No credit card debt or collections</div>
                                <Badge tone={checks.collectionsOk ? "green" : "red"}>
                                  {checks.collectionsOk ? "Yes" : "No"}
                                </Badge>
                              </div>
                              <div className="text-xs text-neutral-500">
                                Income check uses monthly after-tax income vs 2x rent (mock). Rent uses the offer price.
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {selectedRequest ? (
          <div className="mt-4 rounded-2xl border bg-neutral-50 p-4 text-sm">
            <div className="text-sm font-medium">Email Template</div>
            <div className="mt-2 grid gap-2 text-neutral-700">
              <div>
                <span className="text-neutral-500">To:</span> landlord@example.com
              </div>
              <div>
                <span className="text-neutral-500">Subject:</span> Rental application for{" "}
                {selectedRequest.listingAddress}
              </div>
              <div className="rounded-xl border bg-white p-3 leading-relaxed">
                Hello,
                <br />
                <br />
                I have a client interested in {selectedRequest.listingAddress}. Their credit score is{" "}
                {tenantProfile?.creditScore ?? "N/A"} and their annual income is{" "}
                {tenantProfile?.annualIncome?.toLocaleString() ?? "N/A"}. Below are their documents:
                <br />
                <br />
                {docSummary.length === 0 ? (
                  <span>Document list is not available yet (mock).</span>
                ) : (
                  <span>
                    {docSummary.map((doc) => `${doc.label}: ${doc.status}${doc.note ? ` (${doc.note})` : ""}`).join(", ")}
                  </span>
                )}
                <br />
                <br />
                Let me know if this is a fit and if you'd like to proceed.
                <br />
                <br />
                Regards,
              </div>
            </div>
          </div>
        ) : null}
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
