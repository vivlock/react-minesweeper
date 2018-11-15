import React, { Component } from 'react';

class Cell extends Component {
  display = "";
  handleClick = event => {
    const flagButton = event.getModifierState("Alt");
    event.preventDefault();
    this.props.handleCellClick(this.props, flagButton);
  }

  getDisplay = () => {
    const { isFlagged, isRevealed, isMine, surroundingMines } = this.props;
    return isFlagged ? "🚩" : isRevealed ? ( isMine ? "💣" : surroundingMines === 0 ? "" : surroundingMines) : ""
  }

  render() {
    const { isRevealed, isMine } = this.props;
    return (
      <button
        className={`cell ${ isRevealed && isMine ? 'isMine' : '' }`}
        onClick={this.handleClick} disabled={isRevealed}
        >
        {this.getDisplay()}
      </button>
    )
  }
}

export default Cell;
