#!/bin/sh

# Start the redis server
redis-server &

# Start the server
uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000} --workers=1
