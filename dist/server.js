"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerForYourRoute = handlerForYourRoute;
require("dotenv/config");
const opik_1 = require("./lib/opik");
const llamaParse_1 = require("./lib/llamaParse");
async function generateAnswer(prompt) {
    return `Echo: ${prompt}`;
}
async function handlerForYourRoute(prompt) {
    return (0, opik_1.withTrace)("llamaindex.query", async (span) => {
        span.setAttribute("llm.framework", "llamaindex");
        span.setAttribute("runtime", "node");
        span.setAttribute("input.prompt.length", prompt?.length ?? 0);
        return generateAnswer(prompt);
    });
}
function printUsageAndExit() {
    console.error("Usage: node dist/server.js parse <file> --type <markdown|text|json>");
    process.exit(1);
}
async function main(argv) {
    const [command, ...rest] = argv;
    if (!command || command === "query") {
        const prompt = rest.join(" ") || "Olá, Mundo";
        const res = await handlerForYourRoute(prompt);
        console.log(res);
        return;
    }
    if (command === "parse") {
        const fileArg = rest.find((a) => !a.startsWith("--"));
        const typeFlagIndex = rest.findIndex((a) => a === "--type");
        const typeValue = typeFlagIndex >= 0 ? (rest[typeFlagIndex + 1] ?? "markdown") : "markdown";
        if (!fileArg)
            printUsageAndExit();
        const typeNormalized = typeValue.toLowerCase();
        if (!["markdown", "text", "json"].includes(typeNormalized)) {
            printUsageAndExit();
        }
        if (typeNormalized === "markdown") {
            const result = await (0, llamaParse_1.parseToMarkdown)(fileArg);
            console.log(result.outputFilePath);
            return;
        }
        if (typeNormalized === "text") {
            const result = await (0, llamaParse_1.parseToText)(fileArg);
            console.log(result.outputFilePath);
            return;
        }
        // json
        const result = await (0, llamaParse_1.parseToRawJson)(fileArg);
        console.log(result.outputFilePath);
        return;
    }
    printUsageAndExit();
}
// ESM entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2)).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map