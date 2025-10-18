type SimpleSpan = {
    setAttribute: (key: string, value: unknown) => void;
};
export declare function withTrace<T>(name: string, fn: (span: SimpleSpan) => Promise<T>, attributes?: Record<string, unknown>): Promise<T>;
export {};
//# sourceMappingURL=opik.d.ts.map