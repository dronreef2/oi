"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTrace = withTrace;
const opik_1 = require("opik");
const opik = new opik_1.Opik();
async function withTrace(name, fn, attributes) {
    const trace = opik.trace({ name });
    const llmSpan = trace.span({ name, type: "llm" });
    const spanAdapter = {
        setAttribute: (key, value) => {
            // Store attributes in metadata to appear in Opik UI
            llmSpan.update({ metadata: { [key]: value } });
        },
    };
    try {
        if (attributes) {
            for (const [k, v] of Object.entries(attributes))
                spanAdapter.setAttribute(k, v);
        }
        const result = await fn(spanAdapter);
        llmSpan.end();
        trace.update({ output: { result } });
        trace.end();
        await opik.flush();
        return result;
    }
    catch (error) {
        llmSpan.update({
            errorInfo: { message: String(error?.message ?? error), exceptionType: error?.name },
        });
        llmSpan.end();
        trace.update({ errorInfo: { message: String(error?.message ?? error), exceptionType: error?.name } });
        trace.end();
        await opik.flush();
        throw error;
    }
}
//# sourceMappingURL=opik.js.map