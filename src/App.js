import React from "react"
import Navbar from "./components/Navbar"
import Header from "./components/Header"
import Board from "./components/Board"
import "./style.css"
import {nanoid} from "nanoid"

export default function App() {
    const [board, setBoard] = React.useState(generateTiles())
    const [width, setWidth] = React.useState(8)
    const [height, setHeight] = React.useState(8)
    const [minesLeft, setMinesLeft] = React.useState(10)
    const [time, setTime] = React.useState(0)
    const [gameStatus, setGameStatus] = React.useState("")
    
    /**
     * This and the next 3 functions combine to initialise the board
     * @returns empty board of the correct size
     */
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
    
    /**
     * 1. Maps the indexes of the 2d array to a 1d array of the same size.
     * 2. Randomly selects a random index of the 1d array (whose value 
     * corresponds to the index of the 2d array).
     * 3. Put a mine on the corresponding index of the 2d array and 
     * remove that random index of the 1d array (so that it is without 
     * replacement)
     * 4. Repeat until there is a certain # of mines on the 2d array.
     * @returns board with just the mines that are randomly scattered
     */
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
    
    /**
     * 
     * @returns board of values
     */
    function putNumbers() {
        const newBoard = putMines()
        /**
         * Checks if each of the surrounding tiles is a mine, then find the
         * sum of the result.
         * @param {number} row row of the tile
         * @param {number} col column of the tile
         * @returns {number} # of mines around the tile
         */
        function findMinesAroundTile(row, col) {
            /**
             * 
             * @param {number} row row of the tile
             * @param {number} col column of the tile
             * @returns {number} 1 if the tile is a mine, 0 otherwise
             */
            function isMine(row, col) {
                if (row < 0 || row === newBoard.length || 
                    col < 0 || col === newBoard[0].length) {
                    return 0
                }
                return newBoard[row][col] === "*"
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
                    newBoard[i][j] = findMinesAroundTile(i, j)
                }
            }
        }
        return newBoard
    }
    
    /**
     * 
     * @returns board with the properties of the tiles
     */
    function generateTiles() {
        const valuesBoard = putNumbers()
        for (let i = 0; i < valuesBoard.length; i++) {
            for (let j = 0; j < valuesBoard[0].length; j++) {
                valuesBoard[i][j] = {
                    id: nanoid(),
                    value: valuesBoard[i][j],
                    row: i,
                    column: j,
                    isRevealed: false,
                    isFlagged: false,
                    isAutoRevealed: false,
                }
            }
        }
        return valuesBoard
    }

    /**
     * Autoreveals: 
     * 1. unrevealed numbers
     * 2. unflagged and unrevealed mines
     * 3. wrongly flagged tiles
     */
    function loseGame() {
        if (gameStatus !== "lose" && gameStatus !== "win") {
            setGameStatus("lose")
            setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
                return (!tile.isRevealed && tile.value !== "*") || 
                (!tile.isFlagged && !tile.isRevealed && tile.value === "*") ||
                (tile.isFlagged && tile.value !== "*")
                    ? {...tile, isAutoRevealed: true}
                    : tile
            })))
        }
    }

    function revealTile(tileId) {
        if (gameStatus === "win" || gameStatus === "lose") {
            return
        }
        setGameStatus("onGoing")
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            return tile.id === tileId
                ? {...tile, isRevealed: true}
                : tile
        })))
    }

    /**
     * If # of flags around it is equal to its number:
     * 1. Create a copy of the board
     * 2. Update the surrounding tiles (done by a helper function updateTile)
     * @param {number} tileRow row of the tile
     * @param {number} tileColumn column of the tile
     */
    function chord(tileRow, tileColumn) {
        if (gameStatus === "win" || gameStatus === "lose") {
            return
        }
        /**
         * Similar to minesAroundTile.
         * @param {number} row row of the tile
         * @param {number} col column of the tile
         * @returns # of flags around the tile
         */
        function findFlagsAroundTile(row, col) {
            function isFlag(row, col) {
                if (row < 0 || row === board.length || col < 0 || col === board[0].length) {
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
        if (board[tileRow][tileColumn].value === findFlagsAroundTile(tileRow, tileColumn)) {
            const newBoard = []
            for (let i = 0; i < 8; i++) {
                newBoard.push([])
                for (let j = 0; j < 8; j++) {
                    newBoard[i].push(board[i][j])
                }
            }
            /**
             * Reveals the tile under 2 conditions:
             * 1. It is not revealed
             * 2. It is not flagged
             * @param {number} row row of the tile
             * @param {number} col column of the tile
             */
            function updateTile(row, col) {
                if (row < 0 || row === newBoard.length || col < 0 || col === newBoard[0].length) {
                    return
                }
                if (!newBoard[row][col].isRevealed && !newBoard[row][col].isFlagged) {
                    if (newBoard[row][col].value === 0) {
                        function DFS(row, col) {
                            if (row < 0 || row === newBoard.length || col < 0 || 
                                col === newBoard[0].length || newBoard[row][col].isRevealed) {
                                return
                            }
                            newBoard[row][col] = {...newBoard[row][col], isRevealed: true}
                            if (newBoard[row][col].value === 0) {
                                DFS(row - 1, col - 1)
                                DFS(row, col - 1)
                                DFS(row + 1, col - 1)
                                DFS(row - 1, col)
                                DFS(row + 1, col)
                                DFS(row - 1, col + 1)
                                DFS(row, col + 1)
                                DFS(row + 1, col + 1)
                            }
                        }
                        DFS(row, col)
                    } else {
                        newBoard[row][col].isRevealed = true
                    }
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
        }
    }
    
    /**
     * 1. Performs a DFS on the zeroes.
     * 2. Search for its 8 surrounding tiles, revealing it and marking it as
     * visited for each tile (note: isRevealed doubles down as visited)
     * 3. If a tile is visited or is a number, terminate for that fn call.
     * @param {number} tileRow row of the tile
     * @param {number} tileCol column of the tile
     */
    function revealZeroesAroundTile(tileRow, tileCol) {
        const newBoard = []
            for (let i = 0; i < 8; i++) {
                newBoard.push([])
                for (let j = 0; j < 8; j++) {
                    newBoard[i].push(board[i][j])
                }
            }
        function DFS(row, col) {
            if (row < 0 || row === newBoard.length || col < 0 || 
                col === newBoard[0].length || newBoard[row][col].isRevealed) {
                return
            }
            newBoard[row][col] = {...newBoard[row][col], isRevealed: true}
            if (newBoard[row][col].value === 0) {
                DFS(row - 1, col - 1)
                DFS(row, col - 1)
                DFS(row + 1, col - 1)
                DFS(row - 1, col)
                DFS(row + 1, col)
                DFS(row - 1, col + 1)
                DFS(row, col + 1)
                DFS(row + 1, col + 1)
            }
        }
        DFS(tileRow, tileCol)
        setGameStatus("onGoing")
        setBoard(newBoard)
    }

    /**
     * With reference to the tile to be flagged:
     * If it is not revealed and not flagged, flag it
     * If it is not revealed and flagged, unflag it
     * If it is revealed, do nothing
     * @param {string} tileId id of the tile (created by nanoid)
     */
    function flagTile(tileId) {
        if (gameStatus !== "win" && gameStatus !== "lose") {
            setGameStatus("onGoing")
            setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
                if (tile.id !== tileId) {
                    return tile
                } else if (tile.id === tileId && !tile.isRevealed && !tile.isFlagged) {
                    setMinesLeft(oldMinesLeft => oldMinesLeft - 1)
                    return { ...tile, isFlagged: true }
                } else if (tile.id === tileId && !tile.isRevealed && tile.isFlagged) {
                    setMinesLeft(oldMinesLeft => oldMinesLeft + 1)
                    return { ...tile, isFlagged: false }
                } else {
                    return tile
                }
            })))
        }
    }

    /**
     * Removes the context menu upon right click
     */
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
        setTime(0)
        setBoard(generateTiles())
    }

    function changeBoardProperties(width, height, mines) {
        setWidth(width)
        setHeight(height)
        setMinesLeft(mines)
        console.log(width)
        console.log(height)
        console.log(minesLeft)
    }

    /**
     * if we haven't win nor lose the game:
     * if the board contains a revealed mine, the game is lost
     */
    React.useEffect(() => {
        if (gameStatus !== "lose" && gameStatus !== "win" &&
        board.some(row => row.some(tile => tile.value === "*" && tile.isRevealed))) {
            loseGame()
        }
    }, [board])

    /**
     * if we haven't win nor lose the game:
     * if the all the numbers are revealed, the game is won
     */
    React.useEffect(() => {
        if (gameStatus !== "win" && gameStatus !== "lose" && board.every(row => 
            row.every(tile => tile.value === "*" || tile.isRevealed))) {
            setGameStatus("win")
            setMinesLeft(0)
            setBoard(board.map(row => 
                row.map(tile => tile.value === "*" && !tile.isFlagged
                    ? { ...tile, isAutoRevealed: true }
                    : tile)))
        }
    }, [board])

    /**
     * If the game is onGoing, have a timer that increments every second
     * If the game is won or lost, stop the timer
     */
    React.useEffect(() => {
        if (gameStatus === "onGoing") {
            const runTimer = setInterval(() => {
                setTime(oldTime => oldTime + 1)
            }, 1000)
            return () => clearInterval(runTimer)
        }
    }, [gameStatus])
    
    return (
        <div>
            <Navbar 
                changeBoardProperties={changeBoardProperties}
            />
            <Header 
                minesLeft={minesLeft}
                gameStatus={gameStatus}
                resetBoard={resetBoard}
                time={time}
            />
            <Board 
                board={board}
                chord={chord}
                revealZeroesAroundTile={revealZeroesAroundTile}
                revealTile={revealTile}
                flagTile={flagTile}
            />
        </div>
    )
}