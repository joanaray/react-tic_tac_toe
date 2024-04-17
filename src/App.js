import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winnerSquares = Array(9).fill("");
  let gameOver = "";

  let moves = history.map((squares, move) => {
    let description;
    let btnStatus;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    if (currentMove === move) {
      btnStatus = "active";
    }
    return (
      <li key={move} id={move}>
        <button
          type="button"
          className={btnStatus}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  if (calculateWinner(currentSquares, winnerSquares)) {
    gameOver = "game-over";
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // The spread (...) syntax allows an iterable, such as an array or string, to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected.
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reset() {
    for (let i = 0; i < currentSquares.length; i++) {
      currentSquares[i] = null;
    }
    setCurrentMove(0);
    jumpTo(0);
    resetHistory(setHistory);
  }

  return (
    <>
      <div className={`game-board ${gameOver}`}>
        <Board
          xIsNext={xIsNext}
          winnerSquares={winnerSquares}
          squares={currentSquares}
          onPlay={handlePlay}
          onReset={reset}
        />
      </div>
      <div className="game-actions">
        <div className="game-plays">
          <ul>{moves}</ul>
        </div>
      </div>
    </>
  );
}

/** -- COMPONENTS -- */
function Board({ xIsNext, squares, onPlay, winnerSquares, onReset }) {
  function handleClick(i) {
    // If squares already has a value to it (X or O) it'll return early before updating the copied squares list.
    if (squares[i] || calculateWinner(squares, winnerSquares)) {
      return;
    }

    // Creating a copy of squares for the sake of immutability.
    // Immutability makes complex features much easier to implement and makes it very cheap for components to compare whether their data has changed or not.
    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares);
  }

  /** Update player message */
  const winner = calculateWinner(squares, winnerSquares);
  let status;
  const emptySquares = squares.slice();
  if (winner) {
    status = "Winner: " + winner[0];
  } else if (!emptySquares.includes(null)) {
    status = "No one wins.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    console.log("Empty squares? " + emptySquares);
  }

  return (
    <>
      <div id="game-table">
        <Square
          value={squares[0]}
          squareStatus={winnerSquares[0]}
          onSquareClick={() => handleClick(0)}
        />
        <Square
          value={squares[1]}
          squareStatus={winnerSquares[1]}
          onSquareClick={() => handleClick(1)}
        />
        <Square
          value={squares[2]}
          squareStatus={winnerSquares[2]}
          onSquareClick={() => handleClick(2)}
        />
        <Square
          value={squares[3]}
          squareStatus={winnerSquares[3]}
          onSquareClick={() => handleClick(3)}
        />
        <Square
          value={squares[4]}
          squareStatus={winnerSquares[4]}
          onSquareClick={() => handleClick(4)}
        />
        <Square
          value={squares[5]}
          squareStatus={winnerSquares[5]}
          onSquareClick={() => handleClick(5)}
        />
        <Square
          value={squares[6]}
          squareStatus={winnerSquares[6]}
          onSquareClick={() => handleClick(6)}
        />
        <Square
          value={squares[7]}
          squareStatus={winnerSquares[7]}
          onSquareClick={() => handleClick(7)}
        />
        <Square
          value={squares[8]}
          squareStatus={winnerSquares[8]}
          onSquareClick={() => handleClick(8)}
        />
      </div>
      <div className="status">{status}</div>
      <div>
        <button onClick={onReset}>Reset</button>
      </div>
    </>
  );
}
function Square({ value, squareStatus, onSquareClick }) {
  return (
    <button
      type="button"
      className={`square ${squareStatus}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

/** -- FUNCTIONS -- */
function resetHistory(el) {
  el([Array(9).fill(null)]);
}

function calculateWinner(squares, winnerSquares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];
  for (let i = 0; i < lines.length; i++) {
    // Destructuring assignment
    const [a, b, c] = lines[i]; // The destructuring assignment syntax is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log("We have a winner! It's " + squares[a]);

      // Highlight the winning squares
      winnerSquares[a] = "active";
      winnerSquares[b] = "active";
      winnerSquares[c] = "active";
      console.log(
        "winner squares class: " +
          winnerSquares[a] +
          " " +
          winnerSquares[b] +
          " " +
          winnerSquares[c]
      );
      
      return [squares[a], winnerSquares[a], winnerSquares[b], winnerSquares[c]];
    }
  }
  return null;
}
