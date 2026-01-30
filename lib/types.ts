export type TenantStatus = "Browsing" | "Viewing" | "Offer" | "Active" | "Complete" | "Inactive";

export type PropertyStatus =
  | "Viewing Requested"
  | "Viewed"
  | "Applied"
  | "Under Review"
  | "Rejected"
  | "Accepted";

export type ReadinessBadge = "Application Ready" | "Missing Required Documents" | "Agent Review Required";

export type DocType =
  | "Driver's License"
  | "Equifax Credit Report"
  | "Pay Stub #1"
  | "Pay Stub #2"
  | "Letter of Employment"
  | "Rental Application (PDF)"
  | "Notice of Assessment (Optional)"
  | "Immigration Document (If applicable)";

export type DocItem = {
  type: DocType;
  required: boolean;
  uploaded: boolean;
  note?: string;
};

export type PropertyItem = {
  id: string;
  address: string;
  rent: number;
  status: PropertyStatus;
  dateRequested?: string;
  dateViewed?: string;
  dateApplied?: string;
  lastUpdate: string;
};

export type OfferStage = "New" | "Drafting" | "Sent to Listing" | "Countered" | "Accepted" | "Rejected";

export type ListingRequestType = "Viewing" | "Offer";

export type ListingRequestStatus = "Pending" | "Scheduled" | "Submitted" | "Closed";

export type ListingRequest = {
  id: string;
  listingId: string;
  listingAddress: string;
  tenantName: string;
  type: ListingRequestType;
  createdAt: string;
  status: ListingRequestStatus;
  preferredViewingDate?: string;
  offerPrice?: number;
  moveInDate?: string;
  stage?: OfferStage;
};

export type ListingItem = {
  id: string;
  mlsNumber: string;
  address: string;
  city: string;
  province: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  homeType: string;
  yearBuilt?: number;
  parking: string;
  daysOnMarket: number;
  description: string;
  features: string[];
  images: string[];
};

export type TenantProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob: string;
  occupation: string;
  employer: string;
  creditScore?: number;
  annualIncome?: number;
  requestedMoveIn: string;
  immigrationStatus: string;
  tenantStatus: TenantStatus;
  docs: DocItem[];
  properties: PropertyItem[];
  bio?: string;
  coApplicantOrGuarantor: boolean;
};

export type AgentProfile = {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  recoLicense: string;
  verified: boolean;
  referralUrl: string;
};

export type AIAnalysis = {
  risk: "Green" | "Yellow" | "Red";
  summary: string[];
  overridesAllowed: boolean;
};

export type ClientRow = {
  clientId: string;
  fullName: string;
  status: TenantStatus;
  phone?: string;
  creditScore?: number;
  combinedAnnualIncome?: number;
  notesPreview?: string;
  propertiesSummary: string;
  unlocked: boolean;
};
