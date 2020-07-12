import os
import re

import nltk
from flaskapp.stopwords import stopwords
from nltk.stem import WordNetLemmatizer

ntlk_data = os.getenv('NLTK_DATA')

nltk.download('punkt', download_dir=ntlk_data)
nltk.download('wordnet', download_dir=ntlk_data)


stemmer = WordNetLemmatizer()


def split_text(text):
    return nltk.tokenize.sent_tokenize(text)


def clean_string(string):
    string = str(string)
    # Remove all html tags
    string = re.sub(r'/<\/?[\w\s]*>|<.+[\W]>/', ' ', string)
    # Remove all links
    string = re.sub(
        r'/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/', ' ', string)
    # Remove all emails
    string = re.sub(
        r'/^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/', ' ', string)
    # Remove all the special characters
    string = re.sub(r'\W', ' ', string)
    # Remove all single characters
    string = re.sub(r'\s+[a-zA-Z]\s+', ' ', string)
    # Substituting multiple spaces with single space
    string = re.sub(r'\s+', ' ', string, flags=re.I)
    # Converting to Lowercase
    string = string.lower()
    tokens = string.split()

    return tokens


def format_str_to_url_part(string):
    tokens = clean_string(string)
    url_part = '-'.join(tokens[:7])
    return url_part


def tokenize_text(string):
    tokens = clean_string(string)
    # Lemmatization
    tokens = [stemmer.lemmatize(word) for word in tokens]
    tokens = [word for word in tokens if word not in stopwords]
    return tokens


def crop_result(arr, MAX_RESULTS=100):
    return arr[:MAX_RESULTS]
