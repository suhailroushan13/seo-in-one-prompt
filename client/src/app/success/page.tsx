import { redirect } from "next/navigation";
import { buildResultUrl } from "@/lib/resultRedirect";

/**
 * Legacy destination: some checkout configurations still point here. Forward to
 * the single receipt page with the provider's parameters intact.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(buildResultUrl(await searchParams, "success"));
}
