export function pileRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (hash % 1000) / 1000;
  return normalized * 24 - 12;
}

export function pileOffset(id: string): { x: number; y: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 3) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const nx = ((hash % 700) / 700) * 10 - 5;
  const ny = (((hash >> 4) % 700) / 700) * 10 - 5;
  return { x: nx, y: ny };
}
