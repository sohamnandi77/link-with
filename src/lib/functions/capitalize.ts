// capitalie first character of each word in a string
export function capitalizeWords(str?: string | null) {
  if (!str || typeof str !== "string") return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function capitalize(str?: string | null) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0)?.toUpperCase() + str.slice(1)?.toLowerCase();
}
