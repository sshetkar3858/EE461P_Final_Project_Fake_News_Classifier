from flask import Flask
import time
from backend import app

# a simple page that says hello
@app.route('/test')
def hello():
    return {'Hello, World!': "What's good. What's REALLY good?", 'time': time.time()}

@app.route('/')
def home():
    return 'News: Fake or Factual?'