export type LlamaParseResultType = "text" | "markdown" | "raw-json";
export interface ParseOptions {
    resultType: LlamaParseResultType;
    /** If provided, writes the parsed output to this file path. */
    outputFilePath?: string;
    /** Additional CLI flags to forward to llama-parse */
    additionalArgs?: string[];
}
export interface LlamaParseResult {
    inputFilePath: string;
    outputFilePath: string;
    resultType: LlamaParseResultType;
    /** Raw CLI stdout (not the parsed file contents). */
    stdout: string;
    /** Raw CLI stderr. */
    stderr: string;
    /** The parsed file contents read from outputFilePath. */
    outputContent: string;
}
export declare function parseWithLlamaParse(inputFilePath: string, options: ParseOptions): Promise<LlamaParseResult>;
export declare function parseToMarkdown(inputFilePath: string): Promise<LlamaParseResult>;
export declare function parseToText(inputFilePath: string): Promise<LlamaParseResult>;
export declare function parseToRawJson(inputFilePath: string): Promise<LlamaParseResult>;
//# sourceMappingURL=llamaParse.d.ts.map