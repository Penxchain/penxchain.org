"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import WaitlistLayout from "../../wallet-waitlist/components/WaitlistLayout";
import ReCaptchaWrapper from "../../wallet-waitlist/components/ReCaptchaWrapper";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type OverviewResponse = {
  success: boolean;
  windowHours: number;
  sessions: {
    active: number;
    expiringIn24h: number;
    revokedInWindow: number;
  };
  risk: {
    totalEvents: number;
    blockedEvents: number;
    blockedRate: number;
    topReasons: { reason: string; count: number }[];
  };
  actions: { action: string; count: number }[];
};

type EventRow = {
  id: string;
  action: "signup" | "login" | "refresh";
  riskScore: number;
  blocked: boolean;
  reasons: string[] | null;
  countryCode: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string | null;
    email: string | null;
    role: string;
  } | null;
};

type EventsResponse = {
  success: boolean;
  events: EventRow[];
  total: number;
  pages: number;
  page: number;
  limit: number;
};

function AuthObservabilityPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<"" | "signup" | "login" | "refresh">("");
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [hours, setHours] = useState(24);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [recaptchaHealth, setRecaptchaHealth] = useState<{
    secretConfigured: boolean;
    minScore: number;
    allowedHostnames: string[];
    allowAllHostnames?: boolean;
    nodeEnv: string;
  } | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    score: number;
    pass: boolean;
    threshold: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem("penxchain_waitlist_user");
      if (session) {
        const parsed = JSON.parse(session);
        setCurrentRole(parsed?.role || null);
      }
    } catch {
      // noop
    }
  }, []);

  const canRunCleanup = currentRole === "SUPERADMIN";

  const stats = useMemo(() => {
    if (!overview) return [];
    return [
      { label: "Active Sessions", value: overview.sessions.active },
      { label: "Expiring in 24h", value: overview.sessions.expiringIn24h },
      { label: `Revoked (${overview.windowHours}h)`, value: overview.sessions.revokedInWindow },
      { label: `Risk Events (${overview.windowHours}h)`, value: overview.risk.totalEvents },
      { label: "Blocked Events", value: overview.risk.blockedEvents },
      { label: "Blocked Rate", value: `${overview.risk.blockedRate}%` },
    ];
  }, [overview]);

  const fetchOverview = async () => {
    const response = await apiRequest<OverviewResponse>(
      `/admin/auth/overview?hours=${hours}`,
    );
    if (!response.ok) throw response.error;
    setOverview(response.data);
  };

  const fetchEvents = async () => {
    const query = new URLSearchParams({
      page: String(page),
      limit: "20",
    });
    if (actionFilter) query.append("action", actionFilter);
    if (blockedOnly) query.append("blockedOnly", "true");

    const response = await apiRequest<EventsResponse>(
      `/admin/auth/events?${query.toString()}`,
    );
    if (!response.ok) throw response.error;
    setEvents(response.data.events || []);
    setPages(Math.max(1, response.data.pages || 1));
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchOverview(), fetchEvents()]);
      const recaptchaRes = await apiRequest<{
        success: boolean;
        secretConfigured: boolean;
        minScore: number;
        allowedHostnames: string[];
        allowAllHostnames?: boolean;
        nodeEnv: string;
      }>("/admin/auth/recaptcha/health");
      if (recaptchaRes.ok) {
        setRecaptchaHealth({
          secretConfigured: recaptchaRes.data.secretConfigured,
          minScore: recaptchaRes.data.minScore,
          allowedHostnames: recaptchaRes.data.allowedHostnames,
          allowAllHostnames: recaptchaRes.data.allowAllHostnames,
          nodeEnv: recaptchaRes.data.nodeEnv,
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load auth observability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, [page, actionFilter, blockedOnly, hours]);

  const runCleanup = async () => {
    if (!canRunCleanup) return;
    if (!confirm("Run refresh-token cleanup now?")) return;
    setCleanupLoading(true);
    try {
      const response = await apiRequest<{
        success: boolean;
        totalDeleted: number;
        expiredDeleted: number;
        revokedDeleted: number;
      }>("/admin/auth/cleanup", { method: "POST", body: {} });
      if (!response.ok) throw response.error;
      alert(
        `Cleanup completed. Deleted ${response.data.totalDeleted} tokens (expired: ${response.data.expiredDeleted}, revoked: ${response.data.revokedDeleted}).`,
      );
      await fetchAll();
    } catch (err: any) {
      alert(err?.message || "Cleanup failed");
    } finally {
      setCleanupLoading(false);
    }
  };

  const verifyRecaptchaNow = async (action: "signup" | "login") => {
    if (!executeRecaptcha) {
      alert("reCAPTCHA is not initialized in this browser.");
      return;
    }

    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const token = await executeRecaptcha(action);
      const response = await apiRequest<{
        success: boolean;
        score: number;
        pass: boolean;
        threshold: number;
        error?: string;
      }>("/admin/auth/recaptcha/verify", {
        method: "POST",
        body: { token, action },
      });
      if (!response.ok) throw response.error;
      setVerifyResult({
        success: true,
        score: response.data.score,
        pass: response.data.pass,
        threshold: response.data.threshold,
        error: response.data.error,
      });
    } catch (err: any) {
      setVerifyResult({
        success: false,
        score: 0,
        pass: false,
        threshold: recaptchaHealth?.minScore ?? 0.6,
        error: err?.message || "Verification failed",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <WaitlistLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Admin Security</p>
            <h1 className="text-3xl font-black text-white">Auth Observability</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-2 text-xs rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Back to Admin
            </Link>
            <button
              onClick={() => void fetchAll()}
              className="px-3 py-2 text-xs rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              Refresh
            </button>
            <button
              disabled={!canRunCleanup || cleanupLoading}
              onClick={runCleanup}
              className="px-3 py-2 text-xs rounded-md bg-[#2547D0] text-white disabled:opacity-50"
              title={canRunCleanup ? "Run cleanup now" : "Superadmin only"}
            >
              {cleanupLoading ? "Running..." : "Run Cleanup"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-white text-lg font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Window Hours</label>
              <input
                type="number"
                min={1}
                max={168}
                value={hours}
                onChange={(e) => setHours(Math.max(1, Math.min(168, Number(e.target.value) || 24)))}
                className="block mt-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white w-24"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setPage(1);
                  setActionFilter(e.target.value as any);
                }}
                className="block mt-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
              >
                <option value="">All</option>
                <option value="signup">Signup</option>
                <option value="login">Login</option>
                <option value="refresh">Refresh</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={blockedOnly}
                onChange={(e) => {
                  setPage(1);
                  setBlockedOnly(e.target.checked);
                }}
              />
              Blocked only
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-xs text-zinc-400 mb-2">Top Risk Reasons</p>
              <div className="space-y-1">
                {(overview?.risk.topReasons || []).map((r) => (
                  <div key={r.reason} className="flex justify-between text-sm">
                    <span className="text-zinc-300">{r.reason}</span>
                    <span className="text-white font-semibold">{r.count}</span>
                  </div>
                ))}
                {!overview?.risk.topReasons?.length && (
                  <p className="text-zinc-500 text-sm">No recent reasons.</p>
                )}
              </div>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-xs text-zinc-400 mb-2">Action Breakdown</p>
              <div className="space-y-1">
                {(overview?.actions || []).map((a) => (
                  <div key={a.action} className="flex justify-between text-sm">
                    <span className="text-zinc-300">{a.action}</span>
                    <span className="text-white font-semibold">{a.count}</span>
                  </div>
                ))}
                {!overview?.actions?.length && (
                  <p className="text-zinc-500 text-sm">No recent actions.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">reCAPTCHA Diagnostics</p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 text-xs border border-zinc-700 rounded text-zinc-300"
                onClick={() => void fetchAll()}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Secret Configured</p>
              <p className={recaptchaHealth?.secretConfigured ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                {recaptchaHealth?.secretConfigured ? "YES" : "NO"}
              </p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Backend Env</p>
              <p className="text-zinc-200 font-semibold">{recaptchaHealth?.nodeEnv || "-"}</p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Threshold</p>
              <p className="text-zinc-200 font-semibold">{recaptchaHealth?.minScore ?? "-"}</p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Allowed Hostnames</p>
              <p className="text-zinc-200 text-xs">
                {(recaptchaHealth?.allowedHostnames || []).join(", ") || "none"}
              </p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Hostname Policy</p>
              <p className="text-zinc-200 text-xs">
                {recaptchaHealth?.allowAllHostnames ? "allow-all (*)" : "strict allowlist"}
              </p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Frontend Site Key</p>
              <p
                className={
                  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim()
                    ? "text-emerald-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ? "SET" : "MISSING"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={verifyLoading}
              onClick={() => void verifyRecaptchaNow("login")}
              className="px-3 py-2 text-xs rounded-md bg-[#2547D0] text-white disabled:opacity-60"
            >
              {verifyLoading ? "Verifying..." : "Verify Login Token"}
            </button>
            <button
              disabled={verifyLoading}
              onClick={() => void verifyRecaptchaNow("signup")}
              className="px-3 py-2 text-xs rounded-md border border-zinc-700 text-zinc-200 disabled:opacity-60"
            >
              Verify Signup Token
            </button>
          </div>

          {verifyResult && (
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 text-sm">
              <p className="text-zinc-200">
                score: <span className="font-semibold">{verifyResult.score}</span>, threshold:{" "}
                <span className="font-semibold">{verifyResult.threshold}</span>, pass:{" "}
                <span className={verifyResult.pass ? "text-emerald-400" : "text-red-400"}>
                  {verifyResult.pass ? "YES" : "NO"}
                </span>
              </p>
              {verifyResult.error && (
                <p className="text-red-400 text-xs mt-1">error: {verifyResult.error}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <p className="text-white font-semibold">Recent Auth Security Events</p>
            <p className="text-zinc-500 text-xs">Page {page} / {pages}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-zinc-950/70 text-zinc-400">
                <tr>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Action</th>
                  <th className="text-left px-4 py-2">User</th>
                  <th className="text-left px-4 py-2">Score</th>
                  <th className="text-left px-4 py-2">Blocked</th>
                  <th className="text-left px-4 py-2">Country</th>
                  <th className="text-left px-4 py-2">Reasons</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} className="border-t border-zinc-800">
                    <td className="px-4 py-2 text-zinc-300">{new Date(evt.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-zinc-200 uppercase">{evt.action}</td>
                    <td className="px-4 py-2 text-zinc-300">
                      {evt.user?.username || evt.user?.email || evt.user?.id || "anonymous"}
                    </td>
                    <td className="px-4 py-2 text-zinc-200">{evt.riskScore}</td>
                    <td className="px-4 py-2">
                      <span className={evt.blocked ? "text-red-400" : "text-emerald-400"}>
                        {evt.blocked ? "YES" : "NO"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-zinc-300">{evt.countryCode || "-"}</td>
                    <td className="px-4 py-2 text-zinc-400">
                      {(evt.reasons || []).length ? (evt.reasons || []).join(", ") : "-"}
                    </td>
                  </tr>
                ))}
                {!events.length && !loading && (
                  <tr>
                    <td className="px-4 py-6 text-zinc-500 text-center" colSpan={7}>
                      No events found for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              className="px-3 py-1.5 text-xs border border-zinc-700 rounded text-zinc-300 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-1.5 text-xs border border-zinc-700 rounded text-zinc-300 disabled:opacity-40"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {loading && <p className="text-zinc-500 text-sm">Loading auth observability...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </WaitlistLayout>
  );
}

export default function AuthObservabilityPageWrapped() {
  return (
    <ReCaptchaWrapper>
      <AuthObservabilityPage />
    </ReCaptchaWrapper>
  );
}
