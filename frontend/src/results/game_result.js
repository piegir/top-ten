import React, {Component} from "react";


export class GameResult extends Component {
    render() {
        return (
            <div className="Result">
                {this.props.success !== null ?
                    this.props.success ?
                        <div className="ResultText">Game Won!!!</div> :
                        <div className="ResultText">Game Lost</div> :
                    null}
            </div>
        );
    }
}
