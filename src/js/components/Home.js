import React, { Component } from 'react';
import Form from './Form';
import sizeof from 'object-sizeof';
import axios from 'axios';
import languagedetect from 'languagedetect';
import endpoints from '../endpoints';
import InfiniteScroll from 'react-infinite-scroller';

const lngDetector = new languagedetect();

const maxArticlesAmount = 1000;

class Home extends Component {
	state = {
		text: '',
		articles: [],
		loadMoreApiRequestLock: false,
		hasNext: true,
		totalCount: 0,
	};

	pasteTextFromClipboard = () => {
		navigator.clipboard.readText().then(
			clipText => {
				this.setState({
					text: clipText,
				});
			});
	}

	handleChange = (e) => {
		const { value } = e.target;
		this.setState({
			text: value,
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { text } = this.state;

		if(!text) return false;

		const isSizeAllowed = this.checkTextSize(text);
		const isLangAllowed = this.checkTextIsEnglish(text);

		if(isSizeAllowed && isLangAllowed) {
			axios.post(endpoints.addText, { text })
				.then(({ data: { redirect } }) => {
					this.redirectTo(redirect)
				}).catch(error => {
					console.log(error)
				})
		}
	}

	redirectTo = (redirect) => {
		this.props.history.push('/article/' + redirect);
	}

	checkTextSize = (text) => {
		const size = sizeof(text);

		if(size > 1024000) {
			alert('Your text is too big. Max allowed size: 1MB');
			return false;
		}
		return true;
	}

	checkTextIsEnglish = (text) => {
		const possibleLangs = lngDetector.detect(text);
		const possibleLang = possibleLangs.length && possibleLangs[0];

		if(possibleLang[0] != 'english') {
			alert('Only English texts are allowed.');
			return false;
		}
		return true;
	}

	loadNextArticles = () => {
		const { loadMoreApiRequestLock, articles } = this.state;
		const endpoint = endpoints.articlesList + '?offset=' + articles.length;

		if(!loadMoreApiRequestLock) {
			this.setState({ loadMoreApiRequestLock: true });
			axios.get(endpoint)
				.then(({ data }) => {
					const loadedArticles = [...articles, ...data.articles];

					this.setState({
						articles: loadedArticles,
						hasNext: data.hasNext,
						loadMoreApiRequestLock: false,
						totalCount: data.total,
					});
				})
				.catch((error) => {
					this.setState({ loadMoreApiRequestLock: true });
					console.log(error);
				});
		}
	}

	render() {
		const { text, articles, hasNext, totalCount } = this.state;
		const isUploadingAllowed = totalCount <= maxArticlesAmount;

		return (
    <React.Fragment>
        { isUploadingAllowed &&
        <React.Fragment>
            <h2 className="home-title">Upload english text:</h2>
            <Form
                text={text}
                pasteTextFromClipboard={this.pasteTextFromClipboard}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
			/>
        </React.Fragment>}
        <ul>
            <InfiniteScroll
                className="wrapper_article"
                loadMore={this.loadNextArticles}
                hasMore={hasNext}
                loader={<div className="preloader preloader_inner-page" key="loader"></div>}
								>
                {articles.map(article => (
                    <li className="li-item li-article" key={article.id} onClick={() => this.redirectTo(article.title)}>
                        <b>{article.id}.</b>
                        {article.title}
                    </li>
									))}
            </InfiniteScroll>
        </ul>
    </React.Fragment>
		);
	}
}

export default Home;
