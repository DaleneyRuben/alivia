const TINTS = [
  { bg: "#E1EBE4", text: "#3E6B5C" },
  { bg: "#F5E0D8", text: "#C15A3E" },
  { bg: "#EFE7D6", text: "#9A7B3E" },
];

// Deterministic placeholder-avatar tint, cycled by id (design/README.md: Avatar tints)
export function avatarTint(id: string): { bg: string; text: string } {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) {
    sum += id.charCodeAt(i);
  }
  return TINTS[sum % TINTS.length];
}
