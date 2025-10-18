export async function withTrace(_name, fn, attributes) {
    const span = {
        setAttribute: (_k, _v) => {
            /* no-op tracing shim */
        },
    };
    if (attributes) {
        for (const [k, v] of Object.entries(attributes))
            span.setAttribute(k, v);
    }
    return fn(span);
}
//# sourceMappingURL=opik.js.map