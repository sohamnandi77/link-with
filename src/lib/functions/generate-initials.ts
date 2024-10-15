export function generateInitials(name: string): string {
  // Ensure the input is a valid non-empty string
  if (typeof name !== "string" || !name.trim()) {
    console.error("Invalid input: Name must be a non-empty string");
    return "";
  }

  // Trim the input and split by whitespace
  const words = name.trim().split(/\s+/);

  // Handle the single word case, return its first letter in uppercase
  if (words.length === 1) {
    return words[0]?.[0]?.toUpperCase() ?? "";
  }

  // Get the first letter of the first and last words
  const firstInitial = words[0]?.[0]?.toUpperCase() ?? "";
  const lastInitial = words[words.length - 1]?.[0]?.toUpperCase() ?? "";

  // Return the concatenated initials
  return firstInitial + lastInitial;
}
