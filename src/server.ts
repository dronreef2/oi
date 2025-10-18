import "dotenv/config";
import { withTrace } from "./lib/opik.js";
import { parseToMarkdown, parseToRawJson, parseToText } from "./lib/llamaParse.js";
import { pathToFileURL } from "node:url";

async function generateAnswer(prompt: string): Promise<string> {
  return `Echo: ${prompt}`;
}

export async function handlerForYourRoute(prompt: string) {
  return withTrace("llamaindex.query", async (span: { setAttribute: (k: string, v: unknown) => void }) => {
    span.setAttribute("llm.framework", "llamaindex");
    span.setAttribute("runtime", "node");
    span.setAttribute("input.prompt.length", prompt?.length ?? 0);
    return generateAnswer(prompt);
  });
}

function printUsageAndExit(): never {
  console.error(
    "Usage: node dist/server.js parse <file> --type <markdown|text|json>"
  );
  process.exit(1);
}

async function main(argv: string[]): Promise<void> {
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

    if (!fileArg) printUsageAndExit();

    const typeNormalized = typeValue.toLowerCase();
    if (!["markdown", "text", "json"].includes(typeNormalized)) {
      printUsageAndExit();
    }

    if (typeNormalized === "markdown") {
      const result = await parseToMarkdown(fileArg);
      console.log(result.outputFilePath);
      return;
    }
    if (typeNormalized === "text") {
      const result = await parseToText(fileArg);
      console.log(result.outputFilePath);
      return;
    }
    // json
    const result = await parseToRawJson(fileArg);
    console.log(result.outputFilePath);
    return;
  }

  printUsageAndExit();
}

// ESM entrypoint
const isDirectRun = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isDirectRun) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
