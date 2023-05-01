FROM python:3.9

WORKDIR /app
RUN apt update && apt install -y redis-server

COPY ./server /app

RUN pip install -r requirements.txt

ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN chmod +x /app/run.sh
CMD /app/run.sh $PORT
