import { redirect } from "next/navigation";

// The middleware normally handles the redirect to /${locale}/
// This is a fallback in case the middleware is bypassed
export default function RootPage() {
  redirect("/fr");
}
