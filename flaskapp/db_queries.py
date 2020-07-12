from flaskapp import db
from flaskapp.models import Article, Sentense


def get_all_articles(offset, per_page=10):
    page = int(offset) / per_page + 1
    return Article.query.order_by(Article.id.desc()).paginate(page=page, per_page=per_page)


def get_all_sentenses():
    return Sentense.query.all()


def get_sentense_by_id(id):
    return Sentense.query.get(id)


def write_text_to_db(url_address, sentenses):
    exists = check_if_article_exist(url_address)
    if exists:
        last_row = db.session.query(Article).order_by(
            Article.id.desc()).first()
        url_address = url_address + '-' + str(last_row.id + 1)

    article = Article(url_address=url_address)
    for item in sentenses:
        sentense = Sentense(text=item)
        article.sentenses.append(sentense)
    db.session.add(article)
    db.session.commit()
    written_sentenses = []
    for item in article.sentenses:
        written_sentenses.append({'id': item.id, 'text': item.text})
    return {'url_address': article.url_address, 'written_sentenses': written_sentenses}


def write_vectors_to_db(sentense_id, vector):
    sentense = Sentense.query.filter_by(
        id=sentense_id).update({'mean_vector': vector})
    db.session.commit()


def check_if_article_exist(url_address):
    return db.session.query(Article.id).filter_by(url_address=url_address).scalar() is not None


def get_single_article(url_address):
    return db.session.query(Article).filter_by(url_address=url_address).first()
