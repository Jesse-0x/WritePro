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
    redis.rpush('app_id_list', app_id)
    return {"app_id": app_id}


@app.post("/api/suggestions")
def grammar_check(app_id: str, user_prompt: str):
    if bytes(app_id, 'utf-8') not in redis.lrange('app_id_list', 0, -1): return {"error": "Current page is not valid. Please refresh the page."}
    if not isinstance(user_prompt, str): return {"error": "The input text is not valid."}
    if len(user_prompt) == 0: return {"error": "The input is not valid."}
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
            "content": get_user_guidance(user_prompt)
        }
    ]
    token_size = num_tokens_from_messages(message)
    if token_size > 3000:
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

    for item in result:
        redis.rpush(app_id, json.dumps(item))
    redis.set(app_id + "_text", user_prompt)
    return result


@app.post("/api/dialogue")
def dialogue(app_id: str, user_feedback: str, index: int):
    if not redis.exists(app_id): return {"error": "Current page is not valid. Please refresh the page."}
    if not isinstance(index, int) or index < 0 or index >= redis.llen(app_id): return {"error": "The index is not valid."}
    if not isinstance(user_feedback, str) or len(user_feedback) == 0: return {"error": "The input is not valid."}
    message = [
        {
            "role": "system",
            "content": get_feedback_system(redis.lindex(app_id, index), redis.get(app_id + "_text"))
        }
    ]
    previous_dialogues = redis.lrange(app_id + "_feedback", 0, -1)
    for dialogue in previous_dialogues:
        message.append(json.loads(dialogue))
    message.append(
        {
            "role": "user",
            "content": user_feedback
        }
    )
    token_size = num_tokens_from_messages(message)
    if token_size > 4096:
        return {"error": "The input text is too long. Please try again."}
    assistant_prompt = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0,
        max_tokens=4095 - token_size,
        messages=message,
    )
    result = {"index": index, "feedback": assistant_prompt["choices"][0]["text"]}
    dialogues = {"index": index, "feedback": user_feedback, "assistant": assistant_prompt["choices"][0]["text"]}
    redis.rpush(app_id + "_feedback", json.dumps(dialogues))
    return result


