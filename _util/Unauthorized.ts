export function handleUnauthorized(err: any, router: any) {
  if (err.response?.status === 401) {
    const redirect = err.response?.data?.redirect ?? "/";
    router.push(`/auth?redirect=${encodeURIComponent(redirect)}`);
    return true;
  }
  return false;
}
