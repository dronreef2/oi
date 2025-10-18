"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTrace = withTrace;
const opik_1 = require("opik");
async function withTrace(name, fn, attributes) {
    return (0, opik_1.trace)(name, async (span) => {
        if (attributes) {
            for (const [k, v] of Object.entries(attributes))
                span.setAttribute(k, v);
        }
        return fn(span);
    });
}
//# sourceMappingURL=opik.js.map