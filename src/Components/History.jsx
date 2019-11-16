import * as React from "react";
import styles from './History.css';

export class History extends React.Component {
    isSelected(history) {
        return history == this.props.historyId ? 'history-item-selected' : '';
    }

    renderHistoriesList() {
        return this.props.histories.map((history, index) => {
            return (
                <li key={index} className={`history-item ${this.isSelected(history)}`}>{history}</li>
            );
        });
    }

    render() {
        return (
            <div className="history">
                History
                <ul onClick={this.props.onClick}>{this.renderHistoriesList()}</ul>
            </div>
        );
    }
}
