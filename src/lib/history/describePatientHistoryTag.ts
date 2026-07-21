export interface PatientHistorySummary {
  hasMedicalProfile: boolean;
  visitCount: number;
}

export interface PatientHistoryTag {
  tag: "Con historia" | "Nueva";
  sub: string;
}

// matches design/Alivia Panel Prototype.dc.html literally, incl. "registradas" for both counts
export function describePatientHistoryTag({
  hasMedicalProfile,
  visitCount,
}: PatientHistorySummary): PatientHistoryTag {
  if (!hasMedicalProfile) {
    return { tag: "Nueva", sub: "Sin historia — primera visita" };
  }
  return {
    tag: "Con historia",
    sub: `${visitCount} ${visitCount === 1 ? "visita" : "visitas"} registradas`,
  };
}
