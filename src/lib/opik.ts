export async function withTrace<T>(
  _name: string,
  fn: (span: { setAttribute: (k: string, v: unknown) => void }) => Promise<T>,
  attributes?: Record<string, unknown>
): Promise<T> {
  const span = {
    setAttribute: (_k: string, _v: unknown) => {
      /* no-op tracing shim */
    },
  };
  if (attributes) {
    for (const [k, v] of Object.entries(attributes)) span.setAttribute(k, v);
  }
  return fn(span);
}
