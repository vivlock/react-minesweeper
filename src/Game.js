import React, { Component } from 'react';
import './Game.css';
import Board from './Board'

class Game extends Component {
  gameModes = [
    {
      idx: 0,
      display: "easy",
      width: 9,
      height: 9,
      mines: 10
    },
    {
      idx: 1,
      display: "medium",
      width: 16,
      height: 16,
      mines: 40
    },
    {
      idx: 2,
      display: "hard",
      width: 24,
      height: 24,
      mines: 99
    }
  ];
  constructor(props) {
    super(props);
    this.state = { gameId: 0, selectedModeIdx: 0, gameRunning: false, win: false, lose: false, ...this.gameModes[0] };
    console.log(this.state);
  }
  handleModeChange = event => {
    this.setState({ selectedModeIdx: event.target.value, ...this.gameModes[event.target.value] });
  }
  handleStartClick = event => {
    this.setState({
      gameRunning: true,
      gameId: this.state.gameId + 1, //the gameId key change forces the board to reset
      win: false, lose: false
    })
  }
  handleWinGame = () => {
    this.setState({
      win: true
    })
  }
  handleLoseGame = () => {
    this.setState({
      lose: true
    })
  }
  render() {
    const { gameId, selectedModeIdx, gameRunning, width, height, mines, win, lose } = this.state;
    const difficulty = this.gameModes[selectedModeIdx].display
    return (
      <div className="Game">
        <div>
          <select name="gameMode" value={selectedModeIdx} onChange={this.handleModeChange}>
            {this.gameModes.map(mode => (
              <option key={mode.idx} value={mode.idx}>{mode.display}</option>
            ))}
          </select>
          <button onClick={this.handleStartClick}>Start</button>
        </div>
        <div>{win ? "YOU WIN" : lose ? "YOU LOSE" : ""}</div>
        {gameRunning &&
          <Board key={gameId} win={win} lose={lose}
            width={width} height={height} mines={mines}
            difficulty={difficulty}
            handleWin={this.handleWinGame}
            handleLose={this.handleLoseGame}
          />
        }
      </div>
    );
  }
}

export default Game;
