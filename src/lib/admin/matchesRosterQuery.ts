export interface RosterQueryFields {
  doctorName: string;
  practiceLabel: string;
}

// Case-insensitive substring match on doctor name OR practice label (docs/flows/admin.md §1)
export function matchesRosterQuery(
  practice: RosterQueryFields,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    practice.doctorName.toLowerCase().includes(q) ||
    practice.practiceLabel.toLowerCase().includes(q)
  );
}
