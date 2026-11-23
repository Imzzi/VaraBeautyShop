export function RoutineLabel({ step }: { step?: string }) {
  if (!step?.trim()) return null;
  return <bdi className="vara-routine-label">{step}</bdi>;
}
