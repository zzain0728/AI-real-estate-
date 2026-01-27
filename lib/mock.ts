import type { AgentProfile, AIAnalysis, ClientRow, TenantProfile } from "./types";

export const mockAgent: AgentProfile = {
  id: "agent_1",
  fullName: "Azeem Mustafa",
  firstName: "Azeem",
  email: "azeem@example.com",
  phone: "416-555-0123",
  recoLicense: "RECO-123456",
  verified: true,
  referralUrl: "https://yourapp.com/signup?ref=agent_1",
};

export const mockTenant: TenantProfile = {
  id: "tenant_1",
  fullName: "Zain Tariq",
  email: "zain@example.com",
  phone: "647-555-0199",
  dob: "2004-06-10",
  occupation: "Program Coordinator",
  employer: "Healthcare Nonprofit",
  creditScore: 712,
  annualIncome: 78000,
  requestedMoveIn: "2026-02-15",
  immigrationStatus: "Canadian Citizen",
  tenantStatus: "Active",
  coApplicantOrGuarantor: false,
  bio: "Quiet, clean, and respectful tenant. Looking for a long-term lease.",
  docs: [
    { type: "Driver's License", required: true, uploaded: true, note: "Auto-extracted name/DOB/address" },
    { type: "Equifax Credit Report", required: true, uploaded: true },
    { type: "Pay Stub #1", required: true, uploaded: true },
    { type: "Pay Stub #2", required: true, uploaded: false, note: "Missing one recent pay stub" },
    { type: "Letter of Employment", required: true, uploaded: true },
    { type: "Rental Application (PDF)", required: true, uploaded: false, note: "Fillable PDF not uploaded yet" },
    { type: "Notice of Assessment (Optional)", required: false, uploaded: false },
    { type: "Immigration Document (If applicable)", required: false, uploaded: false },
  ],
  properties: [
    {
      id: "p1",
      address: "12 King St W, Toronto, ON",
      rent: 2800,
      status: "Viewing Requested",
      dateRequested: "2026-01-18",
      lastUpdate: "2026-01-18",
    },
    {
      id: "p2",
      address: "88 Lakeshore Blvd, Toronto, ON",
      rent: 3100,
      status: "Applied",
      dateRequested: "2026-01-10",
      dateViewed: "2026-01-12",
      dateApplied: "2026-01-14",
      lastUpdate: "2026-01-14",
    },
  ],
};

export const mockAI: AIAnalysis = {
  risk: "Yellow",
  summary: [
    "Credit score meets threshold (>= 700).",
    "Income appears sufficient (>= 2x rent) for most listings.",
    "One required document missing (Pay Stub #2).",
    "No collections detected in provided report (mock).",
  ],
  overridesAllowed: true,
};

export const mockClients: ClientRow[] = [
  {
    clientId: "tenant_1",
    fullName: "Zain Tariq",
    status: "Active",
    phone: "647-555-0199",
    creditScore: 712,
    combinedAnnualIncome: 78000,
    notesPreview: "Strong profile. Missing one pay stub.",
    propertiesSummary: "Requested: 1 | Viewed: 1 | Applied: 1",
    unlocked: true,
  },
  {
    clientId: "tenant_2",
    fullName: "Sarah Chen",
    status: "Viewing",
    phone: "416-555-0440",
    creditScore: 690,
    combinedAnnualIncome: 92000,
    notesPreview: "Borderline credit, good income.",
    propertiesSummary: "Requested: 2 | Viewed: 0 | Applied: 0",
    unlocked: false,
  },
];
