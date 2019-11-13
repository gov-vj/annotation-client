import * as React from "react";
import { Question } from "./Question";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            isMultiToken: false,
            isTagOn: false
        };
    }

    handleInputChange({target}) {
        const value = target.value === 'false' ? false : true;
        this.setState({
            [target.name]: value
        });
    }

    handleSubmit(ev) {
        ev.preventDefault();
        this.props.history.push(`/isMultiToken/${this.state.isMultiToken}/isTagOn/${this.state.isTagOn}`);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Question
                    question="Select single/multi token(s) feature:"
                    name="isMultiToken"
                    checked={this.state.isMultiToken}
                    handleInputChange={this.handleInputChange}
                    option1="Only single token Selection"
                    option2="Multi tokens Selection"
                />
                <Question
                    question="Turn Baky/Kola tag on/off:"
                    name="isTagOn"
                    checked={this.state.isTagOn}
                    handleInputChange={this.handleInputChange}
                    option1="Off"
                    option2="On"
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}