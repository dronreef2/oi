import { spawn } from "child_process";
import { promises as fs } from "fs";
import * as path from "path";
function ensureApiKey() {
    const apiKey = process.env.LLAMA_CLOUD_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
        throw new Error("Missing LLAMA_CLOUD_API_KEY. Set it in your environment or .env file.");
    }
    return apiKey;
}
function getDefaultOutputPath(inputFilePath, resultType) {
    const outputDir = path.join(process.cwd(), ".llamaparse-output");
    const base = path.parse(inputFilePath).name;
    const ext = resultType === "raw-json" ? ".json" : resultType === "markdown" ? ".md" : ".txt";
    return path.join(outputDir, `${base}${ext}`);
}
function buildCliArgs(inputFilePath, outputFilePath, options) {
    const args = [inputFilePath];
    if (options.resultType === "raw-json") {
        args.push("--output-raw-json");
    }
    else {
        args.push("--result-type", options.resultType);
    }
    args.push("--output-file", outputFilePath);
    if (options.additionalArgs && options.additionalArgs.length > 0) {
        args.push(...options.additionalArgs);
    }
    return args;
}
async function ensureDirectoryForFile(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}
export async function parseWithLlamaParse(inputFilePath, options) {
    ensureApiKey();
    const outputFilePath = options.outputFilePath ?? getDefaultOutputPath(inputFilePath, options.resultType);
    await ensureDirectoryForFile(outputFilePath);
    const cliArgs = buildCliArgs(inputFilePath, outputFilePath, options);
    const stdoutChunks = [];
    const stderrChunks = [];
    await new Promise((resolve, reject) => {
        const child = spawn("llama-parse", cliArgs, {
            env: { ...process.env },
            stdio: ["ignore", "pipe", "pipe"],
        });
        child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
        child.stderr.on("data", (chunk) => stderrChunks.push(chunk));
        child.on("error", (err) => {
            reject(new Error(`Failed to start llama-parse CLI. Is it installed (pip install llama-cloud-services)? Original error: ${err.message}`));
        });
        child.on("close", (code) => {
            if (code !== 0) {
                const errOut = Buffer.concat(stderrChunks).toString("utf8");
                reject(new Error(`llama-parse exited with code ${code}. ${errOut}`));
            }
            else {
                resolve();
            }
        });
    });
    const stdout = Buffer.concat(stdoutChunks).toString("utf8");
    const stderr = Buffer.concat(stderrChunks).toString("utf8");
    const outputContent = await fs.readFile(outputFilePath, "utf8");
    return {
        inputFilePath,
        outputFilePath,
        resultType: options.resultType,
        stdout,
        stderr,
        outputContent,
    };
}
export async function parseToMarkdown(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "markdown" });
}
export async function parseToText(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "text" });
}
export async function parseToRawJson(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "raw-json" });
}
//# sourceMappingURL=llamaParse.js.map