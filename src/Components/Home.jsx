import * as React from "react";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            isMultiToken: false,
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
        this.props.history.push(`/isMultiToken/${this.state.isMultiToken}`);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>Select single/multi token(s) feature:</div>
                <div>
                    <label>
                        <input
                            name="isMultiToken"
                            type="radio"
                            checked={!this.state.isMultiToken}
                            onChange={this.handleInputChange}
                            value={false}
                        />
                        Only single token Selection
                    </label>
                    <label>
                        <input
                            name="isMultiToken"
                            type="radio"
                            checked={this.state.isMultiToken}
                            onChange={this.handleInputChange}
                            value={true}
                        />
                        Multi tokens Selection
                    </label>
                </div>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}