import React from "react"
import Tile from "./components/Tile"
import "./style.css"
import {nanoid} from "nanoid"

export default function App() {
    const [board, setBoard] = React.useState(generateTiles())
    const [minesLeft, setMinesLeft] = React.useState(10)
    const [gameStatus, setGameStatus] = React.useState("")
    
    function generateEmptyBoard() {
        const result = []
        for (let i = 0; i < 8; i++) {
            result.push([])
            for (let j = 0; j < 8; j++) {
                result[i].push("")
            }
        }
        return result
    }
    
    function putMines() {
        const minesBoard = generateEmptyBoard()
        let positions = []
        for (let i = 0; i < 64; i++) {
            positions.push(i)
        }
        for (let i = 0; i < 10; i++) {
            const posIndex = Math.floor(positions.length * Math.random())
            const randomIndex = positions[posIndex]
            const row = Math.floor(randomIndex / 8)
            const col = randomIndex % 8
            minesBoard[row][col] = "*"
            positions = positions.slice(0, posIndex)
                .concat(positions.slice(posIndex + 1, positions.length))
        }
        return minesBoard
    }
    
    function putNumbers() {
        const newBoard = putMines()
        function findMinesAroundIt(row, col) {
            function isMine(row, col) {
                if (row < 0 || row == newBoard.length || 
                    col < 0 || col == newBoard[0].length) {
                    return 0
                }
                return newBoard[row][col] == "*"
                    ? 1
                    : 0
            }
            return isMine(row - 1, col - 1) + isMine(row, col - 1) +
                isMine(row + 1, col - 1) + isMine(row - 1, col) +
                isMine(row + 1, col) + isMine(row - 1, col + 1) +
                isMine(row, col + 1) + isMine(row + 1, col + 1)
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (newBoard[i][j] === "") {
                    newBoard[i][j] = findMinesAroundIt(i, j)
                }
            }
        }
        return newBoard
    }
    
    function generateTiles() {
        const valuesBoard = putNumbers()
        const tilesBoard = []
        for (let i = 0; i < valuesBoard.length; i++) {
            tilesBoard.push([])
            for (let j = 0; j < valuesBoard[0].length; j++) {
                tilesBoard[i].push({
                    id: nanoid(),
                    value: valuesBoard[i][j],
                    row: i,
                    column: j,
                    isRevealed: false,
                    isFlagged: false,
                    isAutoRevealed: false,
                    causedDefeat: false
                })
            }
        }
        return tilesBoard
    }

    function loseGame(tileRow, tileColumn) {
        if (gameStatus !== "lose" && gameStatus !== "win") {
            setGameStatus("lose")
            const newBoard = []
            for (let i = 0; i < 8; i++) {
                newBoard.push([])
                for (let j = 0; j < 8; j++) {
                    i === tileRow && j === tileColumn
                        ? newBoard[i].push({...board[i][j], causedDefeat: true})
                        : !board[i][j].isRevealed || (board[i][j].isFlagged && board[i][j].value !== "*")
                        ? newBoard[i].push({...board[i][j], isAutoRevealed: true}) 
                        : newBoard[i].push(board[i][j])
                }
            }
            setBoard(newBoard)
        }
    }

    function revealTile(tileRow, tileColumn) {
        if (tileRow < 0 || tileRow > 7 || tileColumn < 0 || tileColumn > 7) {
            return
        }
        if (gameStatus === "win" || gameStatus === "lose") {
            return
        }
        /*!board[tileRow][tileColumn].isRevealed && !board[tileRow][tileColumn].isAutoRevealed*/
        // if (!board[tileRow][tileColumn].isRevealed) {
        if (board[tileRow][tileColumn].value === "*") {
            return loseGame(tileRow, tileColumn)
        }
        setGameStatus("onGoing")
        const newBoard = []
        for (let i = 0; i < 8; i++) {
            newBoard.push([])
            for (let j = 0; j < 8; j++) {
                i === tileRow && j === tileColumn
                    ? newBoard[i].push({...board[i][j], isRevealed: true})
                    : newBoard[i].push(board[i][j])
            }
        }
        setBoard(newBoard)
        // setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
        //     return tile.id === tileId && !tile.isFlagged
        //         ? { ...tile, isRevealed: true }
        //         : tile
        // })))
        // } else {
        //     function flagsAroundTile(row, col) {
        //         function isFlag(row, col) {
        //             if (row < 0 || row == board.length || col < 0 || board[0].length) {
        //                 return 0
        //             }
        //             return board[row][col].isFlagged
        //                 ? 1
        //                 : 0
        //         }
        //         return isFlag(row - 1, col - 1) + isFlag(row, col - 1) +
        //             isFlag(row + 1, col - 1) + isFlag(row - 1, col) + 
        //             isFlag(row + 1, col) + isFlag(row - 1, col + 1) +
        //             isFlag(row, col + 1) + isFlag(row + 1, col + 1)
        //     }
        //     if (board[tileRow][tileColumn].value === flagsAroundTile(tileRow, tileColumn)) {
                
        //     }
        // }
    }

    function chord(tileRow, tileColumn) {
        if (gameStatus === "win" || gameStatus === "lose") {
            return
        }
        function flagsAroundTile(row, col) {
            function isFlag(row, col) {
                if (row < 0 || row == board.length || col < 0 || col === board[0].length) {
                    return 0
                }
                return board[row][col].isFlagged
                    ? 1
                    : 0
            }
            return isFlag(row - 1, col - 1) + isFlag(row, col - 1) +
                isFlag(row + 1, col - 1) + isFlag(row - 1, col) + 
                isFlag(row + 1, col) + isFlag(row - 1, col + 1) +
                isFlag(row, col + 1) + isFlag(row + 1, col + 1)
        }
        if (board[tileRow][tileColumn].value === flagsAroundTile(tileRow, tileColumn)) {
            const newBoard = []
            for (let i = 0; i < 8; i++) {
                newBoard.push([])
                for (let j = 0; j < 8; j++) {
                    newBoard[i].push(board[i][j])
                }
            }
            function updateTile(row, col) {
                if (row < 0 || row == newBoard.length || col < 0 || col === newBoard[0].length) {
                    return
                }
                if (!newBoard[row][col].isRevealed && !newBoard[row][col].isFlagged) {
                    // if (newBoard[row][col].value === "*") {
                    //     return loseGame(row, col)
                    // } else {
                    newBoard[row][col].isRevealed = true
                    // }
                }
            }
            updateTile(tileRow - 1, tileColumn - 1)
            updateTile(tileRow - 1, tileColumn)
            updateTile(tileRow - 1, tileColumn + 1)
            updateTile(tileRow, tileColumn - 1)
            updateTile(tileRow, tileColumn + 1)
            updateTile(tileRow + 1, tileColumn - 1)
            updateTile(tileRow + 1, tileColumn)
            updateTile(tileRow + 1, tileColumn + 1)
            setBoard(newBoard)
            // for (let i = -1; i < 2; i++) {
            //     for (let j = -1; j < 2; j++) {
            //         if (!board[tileRow][tileColumn].isRevealed) {
            //         }
            //     }
            // }
            // revealTile(tileRow - 1, tileColumn - 1)
            // revealTile(tileRow - 1, tileColumn)
            // revealTile(tileRow - 1, tileColumn + 1)
            // revealTile(tileRow, tileColumn - 1)
            // revealTile(tileRow, tileColumn + 1)
            // revealTile(tileRow + 1, tileColumn - 1)
            // revealTile(tileRow + 1, tileColumn)
            // revealTile(tileRow + 1, tileColumn + 1)
        }
    }

    function flagTile(tileId, tileRow, tileColumn) {
        if (gameStatus !== "win" && gameStatus !== "lose") {
            setGameStatus("onGoing")
            setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
                if (tile.id !== tileId) {
                    return tile
                } else if (tile.id === tileId && !tile.isRevealed && !tile.isFlagged) {
                    setMinesLeft(oldMinesLeft => oldMinesLeft - 1)
                    return { ...tile, isFlagged: !tile.isFlagged }
                } else if (tile.id === tileId && !tile.isRevealed && tile.isFlagged) {
                    setMinesLeft(oldMinesLeft => oldMinesLeft + 1)
                    return { ...tile, isFlagged: !tile.isFlagged }
                } else {
                    return tile
                }
            })))
        }
    }

    React.useEffect(() => {
        function handleContextMenu(e) {
            e.preventDefault()
        }
        const root = document.getElementById("root")
        root.addEventListener('contextmenu', handleContextMenu)
        return () => {
            root.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])

    function resetBoard() {
        setGameStatus("")
        setMinesLeft(10)
        setBoard(generateTiles())
    }

    function checkLose() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j].value === "*" && board[i][j].isRevealed) {
                    return loseGame(i, j)
                }
            }
        }
    }

    React.useEffect(() => {
        if (gameStatus !== "lose" && gameStatus !== "win") {
            checkLose()
        }
    }, [board])

    React.useEffect(() => {
        if (gameStatus !== "win" && board.every(row => 
            row.every(tile => tile.value === "*" || tile.isRevealed))) {
            setGameStatus("win")
            setMinesLeft(0)
            setBoard(board.map(row => 
                row.map(tile => tile.value === "*" && !tile.isFlagged
                    ? { ...tile, isAutoRevealed: true }
                    : tile)))
        }
    }, [board])
    
    const tileElements = board.map(row => row.map(tile => <Tile 
        key={tile.id}
        value={tile.value}
        row={tile.row}
        column={tile.column}
        isRevealed={tile.isRevealed}
        isAutoRevealed={tile.isAutoRevealed}
        revealTile={() => {
            return tile.isFlagged
                ? null
                : tile.isRevealed
                ? chord(tile.row, tile.column)
                : revealTile(tile.row, tile.column)
        }}
        isFlagged={tile.isFlagged}
        flagTile={() => {
            return tile.isRevealed
                ? null
                : flagTile(tile.id, tile.row, tile.column)
        }}
        causedDefeat={tile.causedDefeat}
    />))
    
    return (
        <div>
            <nav className="app--nav">
                <div className="app--mine-counter">Mines left: {minesLeft}</div>
                <div className="app--nav-middle">
                    {gameStatus === "lose" 
                        ? <div className="app--outcome">You Lost!</div>
                        : gameStatus === "win" && <div className="app--outcome">You Won!</div>
                    }
                    <button className="app--game-button" onClick={resetBoard}>
                        {gameStatus ? "New game" : "Start game"}
                    </button>
                </div>
                <div className="app--stopwatch">Time: 0</div>
            </nav>
            <main className="app--main">
                <div className="app--board-container">
                    {tileElements}
                </div>
            </main>
        </div>
    )
}