import React, {Component} from "react";


export class GameResult extends Component {
    render() {
        return (
            <div>
                {this.props.success !== null ?
                    this.props.success ?
                        <div>Game Won!!!</div> :
                        <div>Game Lost</div> :
                    null}
            </div>
        );
    }
}