import React, { Component } from 'react';
import endpoints from '../endpoints.js';
import axios from 'axios';
import Header from './Header';


class Article extends Component {
	state = {
		sentenses: [],
	}

	componentDidMount() {
		const { match: { params: { title } } } = this.props;

		axios.get(endpoints.singleArticle + title)
			.then(({ data: { sentenses } }) => {
				this.setState({ sentenses });
			}).catch(error => {
				console.log(error);
			})
	}

	redirectTo = (id, text) => {
		const { match: { params: { title } } } = this.props;

		this.props.history.push({
			pathname: '/sentenses/' + id,
			state: { id, text, articleTitle: title }
		});
	}

	render() {
		const { sentenses } = this.state;
		const { match: { params: { title } } } = this.props;

		return (
    <React.Fragment>
        <Header title={title}/>
        <ul>
            {sentenses ? sentenses.map(sent => (
                <li key={sent.id}>
                    <span className="li-item" onClick={() => this.redirectTo(sent.id, sent.text)}>
                        {sent.text}
                    </span>
                </li>
			)) : <div className="preloader preloader_inner"></div>}
        </ul>
    </React.Fragment>
		);
	}
}


export default Article;
