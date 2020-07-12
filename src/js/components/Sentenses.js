import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import endpoints from '../endpoints.js';



const Sentense = ({ text, metric, articleTitle }) => (
    <li className="li-item li-sen">
        <span>{text}</span>
        { metric &&
        <div>
            <span>Similarity metric:&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>{metric}</span>
        </div>
		}
        <div>
            <span>Article:&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Link to={'/article/' + articleTitle} className="art-inner-link">
                {articleTitle}
            </Link>
        </div>
    </li>
)

class Sentences extends Component {
	state = { sentensesLoaded: false }


	componentDidMount() {
		const { match: { params: { id } } } = this.props;

		axios.get(endpoints.findSimilarSentences + id)
			.then(({ data: { origin, sentenses, warning } }) => {
				this.setState({
					warning,
					origin,
					sentenses,
					sentensesLoaded: true
				});
			}).catch(error => {
				console.log(error);
			})
	}

	render() {
		const { location: { state } } = this.props;
		const hasRedirected = typeof state !== "undefined";
		const { text, articleTitle } = hasRedirected && this.props.location.state;
		const { sentensesLoaded, origin, sentenses, warning } = this.state;

		return (
    <React.Fragment>
        <Header title="Similar sentenses"/>
        <ul>
            { hasRedirected &&
            <Sentense
                text={text}
                articleTitle={articleTitle}
						/> }
            { !hasRedirected && sentensesLoaded &&
            <Sentense
                text={origin.text}
                articleTitle={origin.articleTitle}
						/>
					}
            { warning && <li className="li-item li-sen li-warning">{ warning }</li>}
            { sentensesLoaded ? sentenses.map(sen => (
                <Sentense
                    key={sen.id}
                    text={sen.text}
                    metric={sen.metric}
                    articleTitle={sen.articleTitle}
				/>
			)) : <div className="preloader preloader_inner"></div> }
        </ul>
    </React.Fragment>
		);
	}
}


export default Sentences;
