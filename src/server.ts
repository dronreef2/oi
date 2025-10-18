import "dotenv/config";
import { withTrace } from "./lib/opik";

async function generateAnswer(prompt: string): Promise<string> {
  // TODO: Substitua pela sua chamada real ao LLM (LlamaIndex Node ou serviço Python)
  return `Echo: ${prompt}`;
}

export async function handlerForYourRoute(prompt: string) {
  return withTrace("llamaindex.query", async (span) => {
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
