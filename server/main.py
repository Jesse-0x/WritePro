import openai
import fastapi
import uvicorn
import json
import redis
import nanoid
from pydantic import BaseModel

from system import *
from utils import *

openai.api_key = open('/Users/jesse/.env').read().strip()
redis = redis.Redis(host='localhost', port=6379, db=0)

app = fastapi.FastAPI()


class Suggestion(BaseModel):
    app_id: str
    user_prompt: str


class DialogueModel(BaseModel):
    app_id: str
    index: int
    user_feedback: str


@app.get("/")
def read_root():
    return {"Welcome to the Grammar Assistant API!"}


@app.get("/api/app_id")
def read_app_id():
    app_id = nanoid.generate(size=32, alphabet='0123456789abcdefghijklmnopqrstuvwxyz_')
    redis.rpush('app_id_list', app_id)
    return {"app_id": app_id}


@app.post("/api/suggestions")
def grammar_check(suggestion: Suggestion):
    app_id = suggestion.app_id
    user_prompt = suggestion.user_prompt
    if bytes(app_id, 'utf-8') not in redis.lrange('app_id_list', 0, -1): return {
        "error": "Current page is not valid. Please refresh the page."}
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
        if isinstance(result, dict) and {"error"} in result: return result
    except KeyError:
        return {"error": "The model failed to generate a response. Please try again."}
    for item in result:
        redis.rpush(app_id, json.dumps(item))
    redis.set(app_id + "_text", user_prompt)
    return result


@app.post("/api/dialogue")
def dialogue(dialogue_feedback: DialogueModel):
    issue_id = dialogue_feedback.index
    user_feedback = dialogue_feedback.user_feedback
    app_id = dialogue_feedback.app_id
    if not redis.exists(app_id): return {"error": "Current page is not valid. Please refresh the page."}
    if not isinstance(issue_id, int) or issue_id < 0 or issue_id >= redis.llen(app_id): return {"error": "The input is not valid."}
    if not isinstance(user_feedback, str) or len(user_feedback) == 0: return {"error": "The input is not valid."}
    issue = json.loads(redis.lindex(app_id, issue_id))
    message = [
        {
            "role": "system",
            "content": get_feedback_system(issue)
        }
    ]
    previous_dialogues = redis.lrange(app_id + "_feedback", 0, -1)
    for pre_dialogue in previous_dialogues:
        messages = json.loads(pre_dialogue)
        message.append({"role": "user", "content": messages["feedback"]})
        message.append({"role": "assistant", "content": messages["assistant"]})

    message.append(
        {
            "role": "user",
            "content": user_feedback
        }
    )
    token_size = num_tokens_from_messages(message)
    print(token_size, message)
    if token_size > 4096:
        return {"error": "The input text is too long. Please try again."}
    assistant_prompt = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0,
        max_tokens=4095 - token_size,
        messages=message,
    )
    result = {"issue_id": issue_id, "feedback": assistant_prompt["choices"][0]["message"]["content"]}
    dialogues = {"issue_id": issue_id, "feedback": user_feedback, "assistant": assistant_prompt["choices"][0]["message"]["content"]}
    redis.rpush(app_id + "_feedback", json.dumps(dialogues))
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="localhost",
                port=8000,
                workers=1)
