import { Opik, SpanType } from "opik";

const opik = new Opik();

type SimpleSpan = {
  setAttribute: (key: string, value: unknown) => void;
};

export async function withTrace<T>(
  name: string,
  fn: (span: SimpleSpan) => Promise<T>,
  attributes?: Record<string, unknown>
): Promise<T> {
  const trace = opik.trace({ name });
  const llmSpan = trace.span({ name, type: "llm" as SpanType });

  const spanAdapter: SimpleSpan = {
    setAttribute: (key: string, value: unknown) => {
      // Store attributes in metadata to appear in Opik UI
      llmSpan.update({ metadata: { [key]: value } as any });
    },
  };

  try {
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) spanAdapter.setAttribute(k, v);
    }
    const result = await fn(spanAdapter);
    llmSpan.end();
    trace.update({ output: { result } as any });
    trace.end();
    await opik.flush();
    return result;
  } catch (error: any) {
    llmSpan.update({
      errorInfo: { message: String(error?.message ?? error), exceptionType: error?.name },
    } as any);
    llmSpan.end();
    trace.update({ errorInfo: { message: String(error?.message ?? error), exceptionType: error?.name } as any });
    trace.end();
    await opik.flush();
    throw error;
  }
}
