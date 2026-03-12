import AccessUpdateScreen from "./AccessUpdateScreen";

type SearchParamValue = string | string[] | undefined;
type SearchParamsShape = Record<string, SearchParamValue>;

function resolveRequestedPath(value: SearchParamValue) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/wallet-waitlist")) {
    return "/wallet-waitlist/dashboard";
  }
  return candidate;
}

export default async function WaitlistAccessUpdatePage({
  searchParams,
}: {
  searchParams?: SearchParamsShape | Promise<SearchParamsShape>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const requestedPath = resolveRequestedPath(resolvedSearchParams.from);

  return <AccessUpdateScreen requestedPath={requestedPath} />;
}
