export function LocalISOTime() {
  return new Date();
}

export function RandomIdStr() {
  return crypto.randomUUID();
}
export function RandomId() {
  return Math.floor(Math.random() * 1000);
}
export function SortASC(data?: any[]) {
  return [...(data ?? [])]
    .filter((item) => item.createdAt)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}
