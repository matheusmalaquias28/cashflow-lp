import type { Metadata } from "next";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";

export const metadata: Metadata = {
  title: "Ao vivo — Cashflow",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <LiveDashboard />;
}
