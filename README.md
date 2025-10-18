# oi

## LlamaParse Integration

This project includes a simple CLI integration with LlamaParse (from LlamaIndex Cloud) to parse PDFs and other documents into markdown, text, or raw JSON.

### Prerequisites
- Python environment with the CLI installed:
  - Install: `pip install llama-cloud-services`
  - Verify: `llama-parse --help`
- An API key from `https://cloud.llamaindex.ai/api-key`
- Create a `.env` file (copy from `.env.example`) and set `LLAMA_CLOUD_API_KEY`.

### Usage
Build first:

```bash
npm run build
```

Run the parse command (outputs the path of the generated file):

```bash
# markdown
npm run parse:md

# text
npm run parse:txt

# raw JSON
npm run parse:json
```

By default, these scripts try to parse `sample.pdf` in the project root. You can also run the CLI entry directly with a file path:

```bash
node dist/server.js parse ./path/to/file.pdf --type markdown
```

Parsed files are written into `.llamaparse-output/`.

### Notes
- The integration uses the LlamaParse CLI under the hood; no Node SDK is required.
- Ensure `LLAMA_CLOUD_API_KEY` is present in your environment when invoking the CLI.
