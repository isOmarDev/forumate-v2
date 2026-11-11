interface WaitForOptions {
  timeout?: number;
  interval?: number;
}

/**
 * Polls `fn` until it returns a truthy value, or throws once
 * `timeout` elapses. Use this instead of a fixed `setTimeout` sleep when
 * waiting for eventually-consistent state (e.g. an async event handler
 * finishing) — it resolves as soon as the condition is met rather than
 * always waiting the full duration, and fails with a clear timeout error
 * if the condition is never met.
 *
 * @param fn - Checked every `options.interval` ms; return a truthy
 *   value (or resolve one) once the condition is satisfied. Thrown/rejected
 *   errors during a check are swallowed and treated as "not yet" —
 *   only a timeout surfaces as a failure.
 * @param options.timeout - Max time to keep polling, in ms (default 5000).
 * @param options.interval - Delay between checks, in ms (default 100).
 * @throws If the condition is never met within `options.timeout`.
 */

export async function waitFor(
  fn: () => boolean | Promise<boolean>,
  { timeout = 5000, interval = 100 }: WaitForOptions = {},
): Promise<void> {
  const startTime = Date.now();
  let lastError: unknown;

  while (Date.now() - startTime < timeout) {
    try {
      const result = await fn();
      if (result) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(
    `Polling timed out after ${timeout}ms` +
      (lastError ? `. Last error: ${String(lastError)}` : ''),
  );
}
