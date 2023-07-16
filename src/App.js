import React from "react"
import Tile from "./components/Tile"
import "./style.css"
import {nanoid} from "nanoid"

export default function App() {
    const [board, setBoard] = React.useState(generateTiles())
    const [gameStatus, setGameStatus] = React.useState("onGoing")
    
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

    function revealTile(tileId) {
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            return tile.id === tileId && !tile.isFlagged
                ? { ...tile, isRevealed: true }
                : tile
        })))
    }

    function flagTile(tileId) {
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            return tile.id === tileId && !tile.isRevealed
                ? { ...tile, isFlagged: !tile.isFlagged }
                : tile
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

    // React.useEffect(() => {
    //     if (board.map(row => row.filter(tile => tile.value !== "*")))
    // }, [board])
    
    const tileElements = board.map(row => row.map(tile => <Tile 
        key={tile.id}
        value={tile.value}
        isRevealed={tile.isRevealed}
        revealTile={() => revealTile(tile.id)}
        isFlagged={tile.isFlagged}
        flagTile={() => flagTile(tile.id)}
    />))
    
    return (
        <div>
            <nav className="app--nav">
                <div className="app--mine-counter">Mines left: 10</div>
                <button className="app--game-button">Start/end game</button>
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