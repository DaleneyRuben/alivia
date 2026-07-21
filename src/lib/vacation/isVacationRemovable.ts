// "Quitar (before it starts)" (docs/flows/doctor-assistant-panel.md §7)
export function isVacationRemovable(startDate: string, today: string): boolean {
  return today < startDate;
}
