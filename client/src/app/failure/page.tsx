import { redirect } from "next/navigation";
import { buildResultUrl } from "@/lib/resultRedirect";

/** Legacy destination — see the note in /success. */
export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(buildResultUrl(await searchParams, "failure"));
}
