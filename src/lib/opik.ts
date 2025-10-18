import { trace } from "opik";

export async function withTrace<T>(
  name: string,
  fn: (span: { setAttribute: (k: string, v: unknown) => void }) => Promise<T>,
  attributes?: Record<string, unknown>
): Promise<T> {
  return trace(name, async (span) => {
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) span.setAttribute(k, v);
    }
    return fn(span);
  });
}
