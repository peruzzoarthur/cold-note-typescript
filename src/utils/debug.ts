import { appendFileSync } from 'fs';

export function debugLog(message: string) {
  const timestamp = new Date().toISOString();
  appendFileSync('/tmp/coldnote-debug.log', `[${timestamp}] ${message}\n`);
}
