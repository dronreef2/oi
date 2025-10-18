"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerForYourRoute = handlerForYourRoute;
require("dotenv/config");
const opik_1 = require("./lib/opik");
async function generateAnswer(prompt) {
    // TODO: Substitua pela sua chamada real ao LLM (LlamaIndex Node ou serviço Python)
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
// Execução simples via CLI: npm run dev
if (require.main === module) {
    const prompt = process.argv.slice(2).join(" ") || "Olá, Mundo";
    handlerForYourRoute(prompt)
        .then((res) => {
        console.log(res);
    })
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map