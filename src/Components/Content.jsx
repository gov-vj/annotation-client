import * as React from "react";
import * as URLConstant from "../Constants/URL";
import styles from './Content.css';

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.tokenizedContent = this.tokenizedContent.bind(this);
        this.handleTokenChange = this.handleTokenChange.bind(this);
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

    getTokenRelativeUrl() {
        return this.props.match.params.isMultiToken === "false" ? "/single" : "/multi";
    }

    handleTokenChange() {
        const form = document.getElementById('content-form');
        const formData = new FormData(form);
        const tokens = formData.getAll('tokens');
        fetch(URLConstant.TOKEN_SAVE + this.getTokenRelativeUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tokens})
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

            const inputType = this.props.match.params.isMultiToken === "false" ? "radio" : "checkbox";
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
                                className="hidden-input"
                                name="tokens"
                                type={inputType}
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

    restoreTokenState({tokens}) {
        tokens && (tokens.forEach(token => document.getElementById(token).checked = true));
    }

    componentDidMount() {
        this.fetchData(URLConstant.CONTENT_FETCH, this.tokenizedContent);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tokenizedContent !== this.state.tokenizedContent) {
            this.fetchData(URLConstant.TOKEN_FETCH + this.getTokenRelativeUrl(), this.restoreTokenState);
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