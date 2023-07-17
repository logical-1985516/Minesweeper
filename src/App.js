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
        console.log(positions)
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
                    col < 0 || col == newBoard.length) {
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
        return valuesBoard.map(row => row.map(value => ({
            id: nanoid(),
            value: value,
            isRevealed: false,
            isFlagged: false
        })))
    }

    function loseGame() {
        setGameStatus("lose")
    }

    function revealTile(tileId) {
        setGameStatus("onGoing")
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            return tile.id === tileId && !tile.isFlagged
                ? { ...tile, isRevealed: true }
                : tile
        })))
    }

    function flagTile(tileId) {
        setGameStatus("onGoing")
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            if (tile.id !== tileId && !tile.isRevealed && tile.isFlagged) {
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

    // React.useEffect(() => {
    //     if (gameStatus === "lose") {
    //         console.log("You Lost!")
    //     }
    // }, [gameStatus])

    React.useEffect(() => {
        if (board.every(row => 
            row.every(tile => tile.value === "*" || tile.isRevealed))) {
                setGameStatus("win")
        }
    }, [board])
    
    const tileElements = board.map(row => row.map(tile => <Tile 
        key={tile.id}
        value={tile.value}
        isRevealed={tile.isRevealed}
        revealTile={() => {
            return tile.value === "*"
                ? loseGame()
                : revealTile(tile.id)
        }}
        isFlagged={tile.isFlagged}
        flagTile={() => flagTile(tile.id)}
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