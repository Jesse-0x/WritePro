FROM python:3.9

WORKDIR /app
RUN apt update && apt install -y redis-server

COPY ./server /app
COPY ./app/.output/public /app/public

RUN pip install -r requirements.txt

ENV OPENAI_API_KEY=$OPENAI_API_KEY

CMD uvicorn main:app --host=0.0.0.0 --port=$PORT --workers=1
