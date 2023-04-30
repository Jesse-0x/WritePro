FROM python:3.9

WORKDIR /app

COPY ./server /app
COPY ./app/.output /app/public

RUN pip install -r requirements.txt
RUN apt update && apt install -y redis-server
# environment variables PORT in Heroku
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV PORT=$PORT

CMD ["sh", "-c", "uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000} --workers 1"]
