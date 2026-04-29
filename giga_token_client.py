"""LangChain ChatOpenAI client for the Giga Token OpenAI-compatible API."""

import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

load_dotenv()

# The OpenAI client POSTs to .../chat/completions. With the base_url below, requests go to:
# https://api.giga-token.com/rest/V1/chat/completions
GIGA_TOKEN_BASE_URL = "https://api.giga-token.com/rest/V1"
GIGA_TOKEN_API_KEY = os.getenv(
    "GIGA_TOKEN_API_KEY",
    "your-api-key",
)
# Set to the model enabled on your account (e.g. Giga Token model id).
GIGA_TOKEN_MODEL = os.getenv("GIGA_TOKEN_MODEL", "glm-4.5:106b")


def main() -> None:
    llm = ChatOpenAI(
        base_url=GIGA_TOKEN_BASE_URL,
        api_key=GIGA_TOKEN_API_KEY,
        model=GIGA_TOKEN_MODEL,
    )
    response = llm.invoke(
        [HumanMessage(content="Hello. Reply in one short sentence.")]
    )
    print(response.content)


if __name__ == "__main__":
    main()
