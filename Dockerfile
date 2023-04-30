FROM python:3.9

WORKDIR /app

COPY ./server /app

RUN pip install -r requirements.txt
RUN apt update && apt install -y redis-server
# environment variables PORT
EXPOSE

CMD ["python", "main.py"]
