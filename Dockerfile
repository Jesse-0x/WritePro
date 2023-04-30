FROM python:3.9

WORKDIR /app

COPY ./server /app
COPY ./app/.output /app

RUN pip install -r requirements.txt
RUN apt update && apt install -y redis-server
# environment variables PORT in Heroku
ENV PORT=5000

CMD ["python", "main.py"]
