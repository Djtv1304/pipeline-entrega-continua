// src/lib/launchDarkly.ts
import { init, LDClient } from '@launchdarkly/node-server-sdk';

const sdkKey = process.env.LD_SDK_KEY;

if (!sdkKey) {
  console.warn('LD_SDK_KEY no está definido. LaunchDarkly.');
}

export const ldClient: LDClient | null = sdkKey ? init(sdkKey) : null;

export async function isNewMathLogicEnabled(userKey: string) {
  if (!ldClient) {
    return false;
  }

  await ldClient.waitForInitialization();

  return ldClient.variation(
    'new-math-logic',          // nombre del flag en LaunchDarkly
    { key: userKey },          // identificador de usuario
    false                      // valor por defecto
  );
}