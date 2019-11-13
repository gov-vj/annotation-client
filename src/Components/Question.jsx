import * as React from "react";

export class Question extends React.Component {
    render() {
        return (
            <>
                <div>{this.props.question}</div>
                <div>
                    <label>
                        <input
                            name={this.props.name}
                            type="radio"
                            checked={!this.props.checked}
                            onChange={this.props.handleInputChange}
                            value={false}
                        />
                        {this.props.option1}
                    </label>
                    <label>
                        <input
                            name={this.props.name}
                            type="radio"
                            checked={this.props.checked}
                            onChange={this.props.handleInputChange}
                            value={true}
                        />
                        {this.props.option2}
                    </label>
                </div>
            </>
        );
    }
}