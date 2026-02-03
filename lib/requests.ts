import { mockListingRequests } from "@/lib/mock";
import type { ListingRequest } from "@/lib/types";

const STORAGE_KEY = "ai-real-estate:listings:requests";
const EVENT_NAME = "listing-requests-updated";

export function getListingRequests(): ListingRequest[] {
  if (typeof window === "undefined") return mockListingRequests;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mockListingRequests));
      return mockListingRequests;
    }
    const parsed = JSON.parse(raw) as ListingRequest[];
    if (!Array.isArray(parsed)) return mockListingRequests;
    return parsed;
  } catch {
    return mockListingRequests;
  }
}

export function saveListingRequests(requests: ListingRequest[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // no-op
  }
}
