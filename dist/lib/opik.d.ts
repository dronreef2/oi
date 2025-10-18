export declare function withTrace<T>(_name: string, fn: (span: {
    setAttribute: (k: string, v: unknown) => void;
}) => Promise<T>, attributes?: Record<string, unknown>): Promise<T>;
//# sourceMappingURL=opik.d.ts.map