export function splitPayloadPath(payloadPath: string): string[] {
  return payloadPath.split(".").filter((segment) => segment.length > 0);
}
