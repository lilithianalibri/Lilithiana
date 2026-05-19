const SAGGISTICA_PATTERN =
  /(sagg|essay|non[- ]?fiction|reportage|biograf|critica|politic|storic)/i;

export function getEditorialTrack(category: string) {
  return SAGGISTICA_PATTERN.test(category) ? "Saggistica" : "Narrativa";
}
