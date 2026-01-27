"use client";

import { Button, Card, H1, Input, Muted } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function Login() {
  const sp = useSearchParams();
  const router = useRouter();
  const presetRole = sp.get("role") ?? "tenant";

  const [role, setRole] = useState<"tenant" | "agent">(presetRole === "agent" ? "agent" : "tenant");
  const [email, setEmail] = useState("");

  const title = useMemo(() => (role === "tenant" ? "Tenant Login" : "Agent Login"), [role]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <H1>{title}</H1>
      <Muted>Email-only login UI (magic link / one-time code would be wired later).</Muted>

      <div className="mt-4 flex gap-2">
        <Button variant={role === "tenant" ? "primary" : "secondary"} onClick={() => setRole("tenant")}>
          Tenant
        </Button>
        <Button variant={role === "agent" ? "primary" : "secondary"} onClick={() => setRole("agent")}>
          Agent
        </Button>
      </div>

      <Card className="mt-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          {role === "agent" && (
            <div className="rounded-xl border bg-neutral-50 p-3 text-sm">
              <div className="font-medium">Agent sign-up fields (later)</div>
              <Muted>Full name, phone, RECO license, verification flow.</Muted>
            </div>
          )}

          <Button onClick={() => router.push(role === "tenant" ? "/tenant" : "/agent")}>Continue</Button>

          <Muted>This starter routes you to portals with mock data. Replace with real auth and role checks later.</Muted>
        </div>
      </Card>
    </main>
  );
}
