"use client";

import { Badge, Button, Card, H1, H2, Input, Muted, type BadgeTone } from "@/components/ui";
import { mockTenant } from "@/lib/mock";
import { getListingRequests, saveListingRequests } from "@/lib/requests";
import type { ListingItem, PropertyStatus } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

type ListingActionState = {
  viewingDate?: string;
  offerPrice?: string;
  moveInDate?: string;
  lastAction?: "viewing" | "offer";
  agentNotified?: boolean;
};

type ApiListing = {
  id: string;
  ListingKey?: string;
  mlsNumber?: string;
  price?: number;
  propertyType?: string;
  beds?: number | string;
  baths?: number | string;
  parking?: number | string;
  dom?: number;
  address?: string;
  fullAddress?: string;
  city?: string;
  description?: string;
  sqft?: number | string;
  garage?: number | string;
};

const buildImages = (listingKey?: string) => {
  if (!listingKey) return ["/favicon.ico"];
  return [0, 1, 2, 3].map((index) => `/api/image/${listingKey}?index=${index}`);
};

const mapListing = (listing: ApiListing): ListingItem => {
  const address = listing.address || listing.fullAddress || "Unknown";
  return {
    id: listing.id,
    mlsNumber: listing.mlsNumber || listing.ListingKey || "N/A",
    address,
    city: listing.city || "",
    province: "ON",
    rent: Number(listing.price) || 0,
    beds: Number(listing.beds) || 0,
    baths: Number(listing.baths) || 0,
    sqft: Number(listing.sqft) || 0,
    homeType: listing.propertyType || "Residential",
    parking: String(listing.parking ?? listing.garage ?? "0"),
    daysOnMarket: Number(listing.dom) || 0,
    description: listing.description || "",
    features: [],
    images: buildImages(listing.ListingKey),
  };
};

export default function TenantProperties() {
  const [listingQuery, setListingQuery] = useState("");
  const [trackedQuery, setTrackedQuery] = useState("");
  const [listingActions, setListingActions] = useState<Record<string, ListingActionState>>({});
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingLoading, setListingLoading] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);

  useEffect(() => {
    const q = listingQuery.trim();
    const controller = new AbortController();

    const fetchListings = async () => {
      setListingLoading(true);
      setListingError(null);
      try {
        const url = q ? `/api/listings?query=${encodeURIComponent(q)}` : "/api/listings";
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const items: ApiListing[] = Array.isArray(data.listings) ? data.listings : [];
        setListings(items.map(mapListing));
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setListingError("Failed to load listings. Check the database connection.");
        setListings([]);
      } finally {
        setListingLoading(false);
      }
    };

    const timer = setTimeout(fetchListings, q ? 300 : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [listingQuery]);

  const rows = useMemo(() => {
    const q = trackedQuery.trim().toLowerCase();
    if (!q) return mockTenant.properties;
    return mockTenant.properties.filter((p) => p.address.toLowerCase().includes(q));
  }, [trackedQuery]);

  const statusTone = (s: PropertyStatus): BadgeTone => {
    if (s === "Rejected") return "red";
    if (s === "Accepted") return "green";
    if (s === "Under Review") return "yellow";
    return "blue";
  };

  const updateListingAction = (id: string, patch: Partial<ListingActionState>) => {
    setListingActions((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const submitViewingRequest = (listingId: string) => {
    const listing = listings.find((item) => item.id === listingId);
    if (!listing) return;
    const requestDate = new Date().toISOString().slice(0, 10);
    const existing = getListingRequests();
    const next = [
      ...existing,
      {
        id: `r${existing.length + 1}`,
        listingId,
        listingAddress: `${listing.address}, ${listing.city}, ${listing.province}`,
        tenantName: mockTenant.fullName,
        type: "Viewing" as const,
        createdAt: requestDate,
        status: "Pending" as const,
        preferredViewingDate: listingActions[listingId]?.viewingDate || undefined,
      },
    ];
    saveListingRequests(next);
    updateListingAction(listingId, { lastAction: "viewing", agentNotified: true });
  };

  const submitOfferRequest = (listingId: string) => {
    const listing = listings.find((item) => item.id === listingId);
    if (!listing) return;
    const requestDate = new Date().toISOString().slice(0, 10);
    const existing = getListingRequests();
    const next = [
      ...existing,
      {
        id: `r${existing.length + 1}`,
        listingId,
        listingAddress: `${listing.address}, ${listing.city}, ${listing.province}`,
        tenantName: mockTenant.fullName,
        type: "Offer" as const,
        createdAt: requestDate,
        status: "Submitted" as const,
        offerPrice: listingActions[listingId]?.offerPrice
          ? Number(listingActions[listingId]?.offerPrice)
          : undefined,
        moveInDate: listingActions[listingId]?.moveInDate || undefined,
        stage: "New" as const,
      },
    ];
    saveListingRequests(next);
    updateListingAction(listingId, { lastAction: "offer", agentNotified: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <H1>Find a Property</H1>
          <Muted>Search by MLS number or address, request a viewing, or apply instantly.</Muted>
        </div>
        <Button variant="secondary">Saved Searches (later)</Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={listingQuery}
            onChange={(e) => setListingQuery(e.target.value)}
            placeholder="Search MLS or address..."
          />
          <Button variant="ghost" onClick={() => setListingQuery("")}>
            Clear
          </Button>
        </div>
        <div className="mt-4 grid gap-4">
          {listingLoading ? <Muted>Loading listings...</Muted> : null}
          {listingError ? <div className="text-sm text-red-600">{listingError}</div> : null}
          {listings.map((listing) => (
            <Card key={listing.id} className="border border-neutral-200">
              {listingActions[listing.id]?.agentNotified ? (
                <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Agent notified for{" "}
                  {listingActions[listing.id]?.lastAction === "offer" ? "offer request" : "viewing request"}.
                </div>
              ) : null}
              <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={listing.images[0]}
                      alt={`${listing.address} primary photo`}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {listing.images.slice(1).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt={`${listing.address} gallery`}
                        className="h-24 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <H2>
                        {listing.address}, {listing.city}
                      </H2>
                      <Muted>MLS: {listing.mlsNumber}</Muted>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">${listing.rent.toLocaleString()}/mo</div>
                      <Muted>{listing.daysOnMarket} days on market</Muted>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-neutral-700">
                    <Badge tone="blue">{listing.beds} beds</Badge>
                    <Badge tone="blue">{listing.baths} baths</Badge>
                    <Badge tone="blue">{listing.sqft.toLocaleString()} sqft</Badge>
                    <Badge tone="neutral">{listing.homeType}</Badge>
                    <Badge tone="neutral">Parking: {listing.parking}</Badge>
                  </div>

                  <Muted>{listing.description}</Muted>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
                      <div className="text-neutral-500">Key Facts</div>
                      <div className="mt-2 space-y-1 text-neutral-700">
                        <div>Year built: {listing.yearBuilt ?? "N/A"}</div>
                        <div>Type: {listing.homeType}</div>
                        <div>Parking: {listing.parking}</div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
                      <div className="text-neutral-500">Highlights</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {listing.features.map((feature) => (
                          <Badge key={feature} tone="neutral">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="text-sm font-medium">Take Action</div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div className="space-y-2 rounded-xl border bg-white p-3">
                        <div className="text-sm font-medium">Request a Viewing</div>
                        <Input
                          type="date"
                          value={listingActions[listing.id]?.viewingDate ?? ""}
                          onChange={(e) => updateListingAction(listing.id, { viewingDate: e.target.value })}
                        />
                        <Button
                          onClick={() => submitViewingRequest(listing.id)}
                        >
                          Submit Viewing Request
                        </Button>
                      </div>
                      <div className="space-y-2 rounded-xl border bg-white p-3">
                        <div className="text-sm font-medium">Request an Offer</div>
                        <Input
                          type="number"
                          placeholder="Offer price"
                          value={listingActions[listing.id]?.offerPrice ?? ""}
                          onChange={(e) => updateListingAction(listing.id, { offerPrice: e.target.value })}
                        />
                        <Input
                          type="date"
                          value={listingActions[listing.id]?.moveInDate ?? ""}
                          onChange={(e) => updateListingAction(listing.id, { moveInDate: e.target.value })}
                        />
                        <Button
                          variant="secondary"
                          onClick={() => submitOfferRequest(listing.id)}
                        >
                          Submit Offer Request
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="ghost">Share</Button>
                      <Button variant="ghost">Save</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {!listingLoading && listings.length === 0 ? <Muted>No listings match that search yet.</Muted> : null}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <H2>Property Tracking</H2>
            <Muted>Track requests, viewings, applications, and outcomes.</Muted>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input value={trackedQuery} onChange={(e) => setTrackedQuery(e.target.value)} placeholder="Search address..." />
            <Button variant="ghost" onClick={() => setTrackedQuery("")}>
              Clear
            </Button>
          </div>
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
