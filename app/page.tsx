import type { Metadata } from "next";
import { WeddingInvitation } from "./WeddingInvitation";

export const metadata: Metadata = {
  title: "Максим & Елизавета — 29 августа 2026",
  description:
    "Свадебное приглашение Максима и Елизаветы. Будем счастливы разделить этот день с вами.",
};

export default function Home() {
  const rsvpScriptUrl =
    process.env.VITE_RSVP_SCRIPT_URL ??
    process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL ??
    "";
  const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <WeddingInvitation
      rsvpScriptUrl={rsvpScriptUrl}
      assetPrefix={assetPrefix}
    />
  );
}
