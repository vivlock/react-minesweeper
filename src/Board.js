import React, { Component } from 'react';
import Chance from 'chance';
import Cell from './Cell'

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: [],
      height: props.height,
      width: props.width,
      mines: props.mines,
      className: `gameboard gameboard-${props.difficulty}`
    };

    const { width, height } = this.state;
    const chance = new Chance();
    const cellCount = this.state.height * this.state.width;
    const mineCells = chance.unique(chance.integer, this.state.mines, {min: 0, max: cellCount - 1})

    for(let i = 0; i < cellCount; i++) {
      const coords = this.getXYCoordsFromIndex(i)
      const surroundingCoords = this.getSurroundingCells(coords, width, height);
      const surroundingMines = this.calculateSurroundingMines(surroundingCoords, mineCells);
      this.state.cells.push({ index: i, coords, isMine: mineCells.includes(i), surroundingMines, surroundingCoords });
    }
  }

  getSurroundingCells = (cellCoords, gridWidth, gridHeight) => {
    const surroundingCoords = [
      { x: cellCoords.x - 1,  y: cellCoords.y - 1 },
      { x: cellCoords.x - 1,  y: cellCoords.y },
      { x: cellCoords.x - 1,  y: cellCoords.y + 1 },
      { x: cellCoords.x,      y: cellCoords.y - 1 },
      { x: cellCoords.x,      y: cellCoords.y + 1 },
      { x: cellCoords.x + 1,  y: cellCoords.y - 1 },
      { x: cellCoords.x + 1,  y: cellCoords.y },
      { x: cellCoords.x + 1,  y: cellCoords.y + 1 }
    ];
    //remove coords that are out of bounds
    return surroundingCoords.filter((coords) => {
      if (coords.x < 0 || coords.x >= gridWidth ||
          coords.y < 0 || coords.y >= gridHeight) {
        return false;
      }
      return true;
    })
  }

  calculateSurroundingMines = (surroundingCoords, mineCells) => {
    return surroundingCoords.reduce((mineCount, coords) => {
      const index = this.getIndexFromXYCoords(coords);
      if (mineCells.includes(index)) {
        return mineCount + 1;
      }
      return mineCount;
    }, 0);
  }

  getIndexFromXYCoords = (coords) => {
    const { width } = this.state;
    return (coords.x * width) + coords.y;
  }

  getXYCoordsFromIndex = (i) => {
    const { width } = this.state;
    if(i < width) {
      return {x: 0, y: i}
    }
    return {
      x: Math.floor(i / width),
      y: i % width
    }
  }

  handleCellClick = (cell, flagButton) => {
    const { isFlagged, isMine, isRevealed, surroundingMines, surroundingCoords } = cell;
    let updatedCell = this.state.cells[cell.index];

    if (flagButton) {
      updatedCell.isFlagged = !isFlagged;
    }
    else {
      if (!isFlagged && !isRevealed) {
        updatedCell.isRevealed = true;
        if (isMine) {
          this.props.handleLose();
        }
        else if (surroundingMines === 0) {
          //click all surrounding cells to propagate the board clear
          surroundingCoords.forEach(sCoord => {
            this.handleCellClick(this.state.cells[this.getIndexFromXYCoords(sCoord)], false);
          });
        }
      }
    }
    this.setState({
      //this slices out the old cell at cell.index,
      //and spreads the slices before and after the new element
      cells: [
        ...this.state.cells.slice(0, cell.index),
        updatedCell,
        ...this.state.cells.slice(cell.index + 1)
      ]
    })
  }

  render() {
    const { cells, className } = this.state;
    return (
      <>
      <div className={className}>
        {
          cells.map((cell, index) => (
            <Cell key={`cell${index}`} {...cell} handleCellClick={this.handleCellClick} />
          ))
        }
      </div>
      <p>Alt-click to flag mines</p>
      </>
    )
  }
}

export default Board;
