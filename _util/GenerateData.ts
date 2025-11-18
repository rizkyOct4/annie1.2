export function LocalISOTime() {
  return new Date();
}

export function RandomIdStr() {
  return crypto.randomUUID();
}
export function RandomId() {
  return Math.floor(Math.random() * 1000);
}
