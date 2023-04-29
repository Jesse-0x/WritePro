import openai
import fastapi
import tiktoken
import uvicorn
import json
import os


from system import *
from utils import *

openai.api_key = os.getenv("OPENAI_API_KEY")

app = fastapi.FastAPI()


@app.get("/")
def read_root():
    return {"Welcome to the Grammar Assistant API!"}


@app.post("/api/dialog")
def grammar_check(user_prompt: str):
    message = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "system",
                "name": "example_user",
                "content": user_guide_prompt1
            },
            {
                "role": "system",
                "name": "example_assistant",
                "content": assistant_guide_feedback1
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    token_size = num_tokens_from_messages(message)
    if token_size > 4096:
        return {"error": "The input text is too long. Please try again."}
    assistant_prompt = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0,
        max_tokens=4095 - token_size,
        messages=message,
    )
    return assistant_prompt["choices"][0]["message"]["content"]

