import * as React from "react";
import * as URLConstant from "../Constants/URL";
import { History } from "./History";
import styles from './Content.css';

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.tokenizedContent = this.tokenizedContent.bind(this);
        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.handleHistoryClick = this.handleHistoryClick.bind(this);
        this.state = {
            tokenizedContent: '',
            historyId: 'current',
            histories: []
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

    fetchHistoryIds() {
        this.fetchData(
            URLConstant.TOKEN_FETCH + this.getTokenRelativeUrl() + '/history',
            histories => {
                histories.length > 0 && (histories[0] = 'current');
                this.setState({
                    histories,
                    historyId: 'current'
                });
            }
        );
    }

    handleTokenChange() {
        const form = document.getElementById('content-form');
        const formData = new FormData(form);
        const tokens = formData.getAll('tokens');
        const historyId = +new Date();
        fetch(URLConstant.TOKEN_SAVE + this.getTokenRelativeUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tokens, historyId})
        }).then(res => res.json())
        .then(({success}) => {
            if(!success) {
                throw "Error saving data";
            }

            this.isHistoryOn() && this.fetchHistoryIds();
        })
        .catch(err => console.log(err));
    }

    isBakyTag(token) {
        const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
        return vowels.includes(token[0]);
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
                    let tag = "";
                    if (this.props.match.params.isTagOn === "true" && this.isBakyTag(match)) {
                        tag = "baky-tag"
                    }

                    tokenizedContent.push(
                        <span key={tokenId}>
                            <input
                                id={`token${tokenId}`}
                                className="hidden-input"
                                name="tokens"
                                type={inputType}
                                value={`token${tokenId}`}
                                onChange={this.handleTokenChange}/>
                            <label htmlFor={`token${tokenId}`} className={`token-label ${tag}`}>{match}</label>
                        </span>
                    );
                    return;
                }
                tokenizedContent.push(match);
            });
        }

        this.setState({tokenizedContent});
    }

    setTokenState({tokens}) {
        document.querySelectorAll('input:checked').forEach(token => token.checked = false);
        tokens && (tokens.forEach(token => document.getElementById(token).checked = true));
    }

    componentDidMount() {
        this.fetchData(URLConstant.CONTENT_FETCH, this.tokenizedContent);
        this.isHistoryOn() && this.fetchHistoryIds();
    }

    fetchTokens(historyId) {
        this.fetchData(
            URLConstant.TOKEN_FETCH + this.getTokenRelativeUrl() + `/${historyId}`,
            this.setTokenState
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tokenizedContent !== this.state.tokenizedContent) {
            this.fetchTokens(this.state.historyId);
        }
    }

    handleHistoryClick({target}) {
        if(!target.classList.contains('history-item')) {
            return;
        }

        this.fetchTokens(target.textContent);
        this.setState({
            historyId: target.textContent
        });
    }

    isHistoryOn() {
        return this.props.match.params.isHistoryOn === "true";
    }

    render() {
        return (
            <>
                {
                    this.isHistoryOn() ?
                    <History
                        histories={this.state.histories}
                        historyId={this.state.historyId}
                        onClick={this.handleHistoryClick}
                    />
                    : ""
                }
                <form id="content-form">
                    {this.state.tokenizedContent}
                </form>
            </>
        );
    }
}