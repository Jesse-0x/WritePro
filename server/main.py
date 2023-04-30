import openai
import fastapi
import uvicorn
import json
import os
import redis
import nanoid

from system import *
from utils import *

openai.api_key = os.getenv("OPENAI_API_KEY")
redis = redis.Redis(host='localhost', port=6379, db=0)

app = fastapi.FastAPI()


@app.get("/")
def read_root():
    return {"Welcome to the Grammar Assistant API!"}

@app.get("/api/app_id")
def read_app_id():
    app_id = nanoid.generate(size=32)
    redis.set(app_id, 0)
    return {"app_id": app_id}


@app.post("/api/suggestions")
def grammar_check(app_id: str, user_prompt: str):
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
            "content": user_guidance + user_prompt + user_end
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
    try:
        result = json.loads(assistant_prompt["choices"][0]["message"]["content"])
        result = json_check(result)
        if len(result) == 0: return {"error": "The model failed to generate a response. Please try again."}
        if result.keys() == {"error"}: return {"error": "The model failed to generate a response. Please try again."}
    except:
        return {"error": "The model failed to generate a response. Please try again."}

    redis.lpush(app_id, json.dumps(result))
    return result
