import * as React from "react";
import * as URLConstant from "../Constants/URL";
import styles from './Content.css';

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.tokenizedContent = this.tokenizedContent.bind(this);
        this.state = {
            tokenizedContent: '',
        };
    }

    fetchData(url, cb) {
        fetch(url)
        .then(res => res.json())
        .then(data => cb(data))
        .catch(error => console.log(error));
    }

    handleTokenChange() {
        const form = document.getElementById('content-form');
        const formData = new FormData(form);
        const token = formData.get('tokens');
        fetch(URLConstant.TOKEN_SAVE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        }).catch(err => console.log(err));
    }

    tokenizedContent({content}) {
        let m;
        const tokenizedContent = [];
        const regex = /([ \.\,]*)([^ \.\,]+)([ \.\,]*)/g;
        let tokenId = 0;
        while ((m = regex.exec(content)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex === 0) {
                    return;
                } else if (groupIndex === 2) {
                    tokenId++;
                    tokenizedContent.push(
                        <span key={tokenId}>
                            <input
                                id={`token${tokenId}`}
                                name="tokens"
                                type="radio"
                                value={`token${tokenId}`}
                                onChange={this.handleTokenChange}/>
                            <label htmlFor={`token${tokenId}`} className="token-label">{match}</label>
                        </span>
                    );
                    return;
                }
                tokenizedContent.push(match);
            });
        }

        this.setState({tokenizedContent});
    }

    restoreTokenState({token}) {
        token && (document.getElementById(token).checked = true);
    }

    componentDidMount() {
        this.fetchData(URLConstant.CONTENT_FETCH, this.tokenizedContent);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tokenizedContent !== this.state.tokenizedContent) {
            this.fetchData(URLConstant.TOKEN_FETCH, this.restoreTokenState);
        }
    }

    render() {
        return (
            <form id="content-form">
                {this.state.tokenizedContent}
            </form>
        );
    }
}