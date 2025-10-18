"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWithLlamaParse = parseWithLlamaParse;
exports.parseToMarkdown = parseToMarkdown;
exports.parseToText = parseToText;
exports.parseToRawJson = parseToRawJson;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path = __importStar(require("path"));
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
    await fs_1.promises.mkdir(dir, { recursive: true });
}
async function parseWithLlamaParse(inputFilePath, options) {
    ensureApiKey();
    const outputFilePath = options.outputFilePath ?? getDefaultOutputPath(inputFilePath, options.resultType);
    await ensureDirectoryForFile(outputFilePath);
    const cliArgs = buildCliArgs(inputFilePath, outputFilePath, options);
    const stdoutChunks = [];
    const stderrChunks = [];
    await new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)("llama-parse", cliArgs, {
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
    const outputContent = await fs_1.promises.readFile(outputFilePath, "utf8");
    return {
        inputFilePath,
        outputFilePath,
        resultType: options.resultType,
        stdout,
        stderr,
        outputContent,
    };
}
async function parseToMarkdown(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "markdown" });
}
async function parseToText(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "text" });
}
async function parseToRawJson(inputFilePath) {
    return parseWithLlamaParse(inputFilePath, { resultType: "raw-json" });
}
//# sourceMappingURL=llamaParse.js.map