from multiprocessing import Manager, Process
from time import sleep

from termcolor import cprint

import gensim
import gensim.downloader as gensim_api
import nltk
import numpy as np
from flaskapp.db_queries import write_vectors_to_db
from flaskapp.utils import crop_result, tokenize_text
from numpy import ndarray

gensim_model_name = 'glove-wiki-gigaword-50'


def load_model(val, key):
    model = gensim_api.load(gensim_model_name)
    cprint('MODEL LOADED', 'green')
    val[key] = model


WORD2VEC = Manager().dict()
W2V_KEY = 'model'
# run twice cause of debug=True
model = Process(target=load_model, args=(WORD2VEC, W2V_KEY,))
model.start()


def get_mean_vector(words, model):
    # remove out-of-vocabulary words
    words = [word for word in words if word in model.vocab]
    if len(words) >= 1:
        vectors = model[words]
        return np.mean(vectors, axis=0)
    else:
        return None


def process_text(sentense):
    while W2V_KEY not in WORD2VEC:
        cprint('MODEL IS LOADING', 'yellow')
        sleep(1)
    cprint('STRING PROCESSING', 'green')
    tokenized_sentence = tokenize_text(sentense['text'])
    vector = get_mean_vector(tokenized_sentence, WORD2VEC['model'])
    if vector is not None:
        pickle = ndarray.dumps(vector)
        write_vectors_to_db(sentense['id'], pickle)


def get_similar_sentenses(origin, sentenses):
    result = {}
    for sentense in sentenses:
        if origin.id != sentense.id:
            if sentense.mean_vector is not None:
                v1 = np.loads(origin.mean_vector)
                v2 = np.loads(sentense.mean_vector)
                similarity = cosine_similarity(v1, v2)
                float_limit = 8
                similarity_native = round(float(similarity), float_limit)
                sentense_data = {
                    'id': sentense.id,
                    'text': sentense.text,
                    'article_url': sentense.articles.url_address
                }
                if similarity_native in result:
                    result[similarity_native].append(sentense_data)
                else:
                    result[similarity_native] = [sentense_data]

    sorted_results = sorted(result.items(), reverse=True)
    sorted_results = dict(crop_result(sorted_results))
    return sorted_results


def cosine_similarity(vA, vB):
    return np.dot(vA, vB) / (np.linalg.norm(vA) * np.linalg.norm(vB))
