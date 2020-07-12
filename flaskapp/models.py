from flaskapp import db


class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    url_address = db.Column(db.String(120), index=True, unique=True)
    sentenses = db.relationship('Sentense', backref='articles', lazy='dynamic')

    def __repr__(self):
        return '<Article {}>'.format(self.url_address)


class Sentense(db.Model):
    _tablename__ = 'sentenses'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    mean_vector = db.Column(db.PickleType, nullable=True)
    article_id = db.Column(db.Integer, db.ForeignKey(
        'articles.id'), nullable=False)

    def __repr__(self):
        return '<Sentense {}>'.format(self.id)
