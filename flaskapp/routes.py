import json
from multiprocessing import Pool, cpu_count

from termcolor import cprint

from flask import jsonify, render_template, request
from flaskapp import app
from flaskapp.calculations import get_similar_sentenses, process_text
from flaskapp.db_queries import (get_all_articles, get_all_sentenses,
                                 get_sentense_by_id, get_single_article,
                                 write_text_to_db)
from flaskapp.utils import crop_result, format_str_to_url_part, split_text
from werkzeug.exceptions import HTTPException

CPUs = cpu_count()
used_CPUs = round(CPUs * 2 / 3)
cprint('Used CPUs:' + str(used_CPUs), 'green')
# Should be there according to: https://docs.python.org/3/library/multiprocessing.html#using-a-pool-of-workers
pool = Pool(used_CPUs)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template("index.html")


@app.route('/api/articles-list', methods=['GET'])
def get_articles():
    if request.method == 'GET':
        offset = request.args.get('offset')
        articles_list = []
        query = get_all_articles(offset)
        for article in query.items:
            articles_list.append(
                {'id': article.id, 'title': article.url_address})
        return jsonify({'articles': articles_list, 'hasNext': query.has_next, 'total': query.total, 'page': query.page})
    return False


@app.route('/api/add-text', methods=['POST'])
def add_new_article():
    if request.method == 'POST':
        text = request.json['text']
        sentenses = split_text(text)
        if len(sentenses):
            url_address = format_str_to_url_part(sentenses[0])
            result = write_text_to_db(url_address, sentenses)
            created_url = result['url_address']
            pool.map_async(process_text, result['written_sentenses'])
            return jsonify({'redirect': created_url})
    return False


@app.route('/api/similar/<int:sentense_id>', methods=['GET'])
def find_similar_sentences(sentense_id):
    if request.method == 'GET':
        origin = get_sentense_by_id(sentense_id)
        origin_dict = {'text': origin.text,
                       'articleTitle': origin.articles.url_address}
        if origin.mean_vector is None:
            return jsonify({'warning': 'Your text still processing or it can\'t be processed probably because contains too few unique words. Try again later.', 'origin': origin_dict, 'sentenses': []})

        result = get_all_sentenses()
        sorted_sentenses = get_similar_sentenses(origin, result)
        sentenses = []
        for key, arr in sorted_sentenses.items():
            for item in arr:
                sentenses.append({
                    'id': item['id'],
                    'metric': key,
                    'text': item['text'],
                    'articleTitle': item['article_url'],
                })
        sentenses = crop_result(sentenses)
        return jsonify({'origin': origin_dict, 'sentenses': sentenses, 'warning': ''})
    return False


@app.route('/api/article/<string:article_title>', methods=['GET'])
def show_subpath(article_title):
    if request.method == 'GET':
        data = get_single_article(article_title)
        sentenses = []
        for item in data.sentenses:
            sentenses.append({'id': item.id, 'text': item.text})
        return jsonify({'sentenses': sentenses})
    return False


@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response
