"use client";

import React, { useEffect } from "react";
import "../styles/sudokuGrid.css";
import { useState } from "react";
import easySudoku from "../../../../sudoku-api/data/easy_10_sudoku.json";
import hardSudoku from "../../../../sudoku-api/data/hard_10_sudoku.json";
import evilSudoku from "../../../../sudoku-api/data/evil_10_sudoku.json";

const getInitialGrid = () => [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const generateGridFromSudoku = (sudokuString) => {
  const grid = [];
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const value = sudokuString.charAt(i * 9 + j);
      row.push(value === "." ? 0 : parseInt(value, 10));
    }
    grid.push(row);
  }
  return grid;
};

export default function SudokuGrid() {
  const [grid, setGrid] = useState(getInitialGrid());

  function setGridValue(rowIndex, cellIndex, value) {
    if (/^[1-9]?$/.test(value)) {
      const newGrid = [...grid];
      newGrid[rowIndex][cellIndex] = value === "" ? 0 : parseInt(value, 10);
      setGrid(newGrid);
    }
  }

  function handleClearPuzzle() {
    setGrid(getInitialGrid());
  }
  const handleSolvePuzzle = async () => {
    let puzzleAsString = "";
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < grid[rowIndex].length; cellIndex++) {
        const value = grid[rowIndex][cellIndex];
        puzzleAsString += value === 0 ? "." : value;
      }
    }
    const response = await fetch("http://127.0.0.1:8010/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sudoku: [puzzleAsString],
      }),
    });
    const json = await response.json();
    const solution = json.data[0].solution;
    const newGrid = new Array(9).fill("").map(() => new Array(9).fill(0));
    for (let rowIndex = 0; rowIndex < newGrid.length; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < newGrid[rowIndex].length;
        cellIndex++
      ) {
        newGrid[rowIndex][cellIndex] = parseInt(
          solution.charAt(rowIndex * 9 + cellIndex)
        );
      }
    }

    setGrid(newGrid);
  };

  const difficultyMapping = {
    easy: easySudoku,
    hard: hardSudoku,
    evil: evilSudoku,
  };

  function handleSetDifficulty(level) {
    const randomNumber = Math.floor(Math.random() * 11);
    const selectedSudoku = difficultyMapping[level];
    const sudokuString = selectedSudoku.sudoku[randomNumber];
    const newGrid = generateGridFromSudoku(sudokuString);
    setGrid(newGrid);
  }

  return (
    <div className="general">
      <div className="title">
        <h1>SuuuuuuuDoku</h1>
      </div>
      <div className="difficulty">
        <button onClick={() => handleSetDifficulty("easy")}>Easy</button>
        <button onClick={() => handleSetDifficulty("hard")}>Hard</button>
        <button onClick={() => handleSetDifficulty("evil")}>Evil</button>
      </div>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div className="cell" key={`${rowIndex}-${cellIndex}`}>
              <input
                type="text"
                onChange={(e) =>
                  setGridValue(rowIndex, cellIndex, e.target.value)
                }
                value={cell === 0 ? "" : cell}
                maxLength={1}
              />
            </div>
          ))
        )}
      </div>
      <div className="section-button">
        <button onClick={handleSolvePuzzle}>Solve</button>
        <button onClick={handleClearPuzzle}>Clear</button>
      </div>
    </div>
  );
}
