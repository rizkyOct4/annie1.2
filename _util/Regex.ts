export function ValidRegex() {
  const hashtagRegex = /^[a-zA-Z0-9_]+$/;
  return hashtagRegex;
}
export function FormRegex() {
  const hashtagRegex = /^[a-zA-Z0-9_]*$/; // ? nilai kosong boleh
  return hashtagRegex;
}
export function InvalidCharRegex() {
  return /[^a-zA-Z0-9\s.,!?'"()-]/; // ? karakter yang tidak valid
}
export function CapitalizeRegex() {
  const capitalStartRegex = /^[A-Z][a-zA-Z0-9_]*$/;
  return capitalStartRegex; // ? huruf pertama kapital, diikuti huruf kecil, angka, atau underscore
}

// ? .match() => method milik string, bukan objek RegExp.
export function ForbiddenRegex() {
  const forbiddenCharsRegex = /[*/,.<>;:'"|=+()[\]{}?!&^%$#@]/g; // ? g => global(mengambil keseluruhan string)
  return forbiddenCharsRegex;
}
// ? Bagian	Arti
// ? /.../	Penulisan literal Regex di JavaScript / TypeScript
// ? ^	Menandakan awal string
// ? [a-zA-Z0-9_]	Izinkan karakter a-z, A-Z, 0-9, dan _
// ? +	Artinya: satu atau lebih dari karakter yang valid di dalam []
// ? $	Menandakan akhir string

// * after9 => _ diperbolehkan
