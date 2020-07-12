import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flaskapp.config import Config

app = Flask(__name__)

app.config.from_object(Config)

CORS(app, resources={r'/*': {'origins': '*'}})

db = SQLAlchemy(app)

basedir = os.path.abspath(os.path.dirname(__file__))

GENSIM_DATA_DIR = basedir + '/gensim-data'
os.environ['GENSIM_DATA_DIR'] = GENSIM_DATA_DIR

NLTK_DATA = basedir + '/nltk_data'
os.environ['NLTK_DATA'] = NLTK_DATA

from flaskapp import routes
from flaskapp import models

db.create_all()
