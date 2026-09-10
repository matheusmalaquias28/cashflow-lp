import type { Metadata } from "next";
import { DashboardGeral } from "@/components/mock/DashboardGeral";

export const metadata: Metadata = {
  title: "Dashboard Geral — Cashflow",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardGeral full />;
}
