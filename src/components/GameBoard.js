import React from "react"
import Header from "./Header"
import Board from "./Board"
import GameResult from "./GameResult"
import {nanoid} from "nanoid"

export default function GameBoard(props) {
    const difficulty = props.boardProperties.difficulty
    const height = props.boardProperties.height
    const width = props.boardProperties.width
    const initialMines = props.boardProperties.initialMines
    const [minesLeft, setMinesLeft] = React.useState(props.initialMines)
    const [board, setBoard] = React.useState(generateTiles)
    const [time, setTime] = React.useState(0)
    const [startTime, setStartTime] = React.useState()
    const [endTime, setEndTime] = React.useState()
    const [threeBV, set3BV] = React.useState(find3BV)
    const [current3BV, setCurrent3BV] = React.useState(0)
    const showMetricsData = props.showMetricsData
    const [usefulLeftClicks, setUsefulLeftClicks] = React.useState(0)
    const [usefulRightClicks, setUsefulRightClicks] = React.useState(0)
    const [usefulChords, setUsefulChords] = React.useState(0)
    const [wastedLeftClicks, setWastedLeftClicks] = React.useState(0)
    const [wastedRightClicks, setWastedRightClicks] = React.useState(0)
    const [wastedChords, setWastedChords] = React.useState(0)
    const [finished1stClick, setFinished1stClick] = React.useState(false)
    const [firstRevealedPos, setFirstRevealedPos] = React.useState(null)
    const [gameStatus, setGameStatus] = React.useState("")
    
    /**
     * This and the next 3 functions combine to initialise the board
     * @returns empty board of the correct size
     */
    function generateEmptyBoard() {
        const result = []
        for (let i = 0; i < height; i++) {
            result.push([])
            for (let j = 0; j < width; j++) {
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
    function putMines(row, column) {
        const minesBoard = generateEmptyBoard()
        let positions = []
        for (let i = 0; i < height * width; i++) {
            if (i !== row * width + column) {
                positions.push(i)
            }
        }
        for (let i = 0; i < initialMines; i++) {
            const posIndex = Math.floor(positions.length * Math.random())
            const randomIndex = positions[posIndex]
            const row = Math.floor(randomIndex / width)
            const col = randomIndex % width
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
    function putNumbers(row, column) {
        const newBoard = putMines(row, column)
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
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
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
    function generateTiles(row, column) {
        const valuesBoard = putNumbers(row, column)
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
                    isFlaggedBefore: false
                }
            }
        }
        return valuesBoard
    }

    /**
     * 
     * @returns minimum number of clicks to win the game without flagging
     */
    function find3BV() {
        const visited = []
        let threeBV = 0
        for (let i = 0; i < height; i++) {
            visited.push([])
            for (let j = 0; j < width; j++) {
                visited[i].push(false)
            }
        }
        function DFS(row, col) {
            if (row < 0 || row === height || col < 0 || col === width ||
                visited[row][col]) {
                return
            }
            visited[row][col] = true
            if (board[row][col].value === 0) {
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
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (board[i][j].value === 0 && !visited[i][j]) {
                    DFS(i, j)
                    threeBV++
                }
            }
        }
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!visited[i][j] && board[i][j].value !== "*") {
                    threeBV++
                }
            }
        }
        return threeBV
    }

    function revealTile(tileRow, tileColumn) {
        if (gameStatus !== "win" && gameStatus !== "lose") {
            if (board[tileRow][tileColumn].isRevealed || board[tileRow][tileColumn].isFlagged) {
                setWastedLeftClicks(oldWastedLeftClicks => oldWastedLeftClicks + 1)
                return
            }
            setGameStatus("onGoing")
            const newBoard = []
            for (let i = 0; i < height; i++) {
                newBoard.push([])
                for (let j = 0; j < width; j++) {
                    if (i !== tileRow || j !== tileColumn) {
                        newBoard[i].push(board[i][j])
                    } else {
                        if (!finished1stClick && board[i][j].value === "*") {
                            newBoard[i].push({...board[i][j], isRevealed: false})
                            setFirstRevealedPos({row: tileRow, column: tileColumn})
                        } else {
                            newBoard[i].push({...board[i][j], isRevealed: true})
                        }
                    }
                }
            }
            setUsefulLeftClicks(oldUsefulLeftClicks => oldUsefulLeftClicks + 1)
            setBoard(newBoard)
        }
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
        
        function allRevealedOrFlagged(row, col) {
            function isRevealedOrFlagged(row, col) {
                if (row < 0 || row === height || col < 0 || col === width) {
                    return true
                }
                if (board[row][col].isRevealed || board[row][col].isFlagged) {
                    return true
                }
                return false
            }
            return isRevealedOrFlagged(row - 1, col - 1) &&
                isRevealedOrFlagged(row, col - 1) &&
                isRevealedOrFlagged(row + 1, col - 1) &&
                isRevealedOrFlagged(row - 1, col) &&
                isRevealedOrFlagged(row + 1, col) &&
                isRevealedOrFlagged(row - 1, col + 1) &&
                isRevealedOrFlagged(row, col + 1) &&
                isRevealedOrFlagged(row + 1, col + 1)
        }

        if (board[tileRow][tileColumn].value !== findFlagsAroundTile(tileRow, tileColumn) ||
            allRevealedOrFlagged(tileRow, tileColumn)) {
            setWastedChords(oldWastedChords => oldWastedChords + 1)
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
            for (let i = 0; i < height; i++) {
                newBoard.push([])
                for (let j = 0; j < width; j++) {
                    newBoard[i].push(board[i][j])
                }
            }
            /**
             * Reveals the tile under 2 conditions:
             * 1. It is not revealed
             * 2. It is not flagged
             * If one of the tiles revealed through chording has value 0,
             * "call" revealZeroesAroundTile (since calling it does not seem
             * to work, code from it is repeated here).
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
            setUsefulChords(oldUsefulChords => oldUsefulChords + 1)
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
    function revealZeroesAroundTile(tileRow, tileColumn) {
        if (gameStatus === "win" || gameStatus === "lose") {
            return
        }
        if (board[tileRow][tileColumn].isRevealed || board[tileRow][tileColumn].isFlagged) {
            setWastedLeftClicks(oldWastedLeftClicks => oldWastedLeftClicks + 1)
            return
        }
        const newBoard = []
        for (let i = 0; i < height; i++) {
            newBoard.push([])
            for (let j = 0; j < width; j++) {
                newBoard[i].push(board[i][j])
            }
        }
        function DFS(row, col) {
            if (row < 0 || row === newBoard.length || col < 0 || 
                col === newBoard[0].length || newBoard[row][col].isRevealed || 
                newBoard[row][col].isFlagged) {
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
        DFS(tileRow, tileColumn)
        setGameStatus("onGoing")
        setUsefulLeftClicks(oldUsefulLeftClicks => oldUsefulLeftClicks + 1)
        setBoard(newBoard)
    }

    /**
     * With reference to the tile to be flagged:
     * If it is not revealed and not flagged, flag it
     * If it is not revealed and flagged, unflag it
     * If it is revealed, do nothing
     * @param {string} tileId id of the tile (created by nanoid)
     */
    function flagTile(tileRow, tileColumn) {
        if (gameStatus !== "win" && gameStatus !== "lose") {
            if (board[tileRow][tileColumn].isRevealed) {
                setWastedRightClicks(oldWastedRightClicks => oldWastedRightClicks + 1)
                return
            }
            setGameStatus("onGoing")
            const newBoard = []
            for (let i = 0; i < height; i++) {
                newBoard.push([])
                for (let j = 0; j < width; j++) {
                    if (i !== tileRow || j !== tileColumn) {
                        newBoard[i].push(board[i][j])
                    } else {
                        if (!board[i][j].isFlagged) {
                            setMinesLeft(oldMinesLeft => oldMinesLeft - 1)
                            if (board[i][j].value !== "*" || board[i][j].isFlaggedBefore) {
                                setWastedRightClicks(oldWastedRightClicks => 
                                    oldWastedRightClicks + 1)
                                newBoard[i].push({...board[i][j], isFlagged: true})
                            } else {
                                setUsefulRightClicks(oldUsefulRightClicks => 
                                    oldUsefulRightClicks + 1)
                                newBoard[i].push({
                                    ...board[i][j], 
                                    isFlagged: true, 
                                    isFlaggedBefore: true})
                            }
                        } else {
                            setMinesLeft(oldMinesLeft => oldMinesLeft + 1)
                            setWastedRightClicks(oldWastedRightClicks => oldWastedRightClicks + 1)
                            newBoard[i].push({...board[i][j], isFlagged: false})
                        }
                    }
                }
            }
            setBoard(newBoard)
        }
    }

    function findCurrent3BV() {
        const visited = []
        let threeBV = 0
        let visitedRevealed = false
        for (let i = 0; i < height; i++) {
            visited.push([])
            for (let j = 0; j < width; j++) {
                visited[i].push(false)
            }
        }
        function DFS(row, col) {
            if (row < 0 || row === height || col < 0 || col === width ||
                visited[row][col]) {
                return
            }
            visited[row][col] = true
            if (board[row][col].isRevealed) {
                visitedRevealed = true
            }
            if (board[row][col].value === 0) {
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
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (board[i][j].value === 0 && !visited[i][j]) {
                    visitedRevealed = false
                    DFS(i, j)
                    visitedRevealed && threeBV++
                }
            }
        }
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!visited[i][j] && board[i][j].value !== "*" && board[i][j].isRevealed) {
                    threeBV++
                }
            }
        }
        return threeBV
    }

    /**
     * Autoreveals: 
     * 1. unrevealed numbers
     * 2. unflagged and unrevealed mines
     * 3. wrongly flagged tiles
     */
    function loseGame() {
            setEndTime(Date.now())
        setGameStatus("lose")
        setCurrent3BV(findCurrent3BV())
        setBoard(oldBoard => oldBoard.map(row => row.map(tile => {
            return (!tile.isRevealed && tile.value !== "*") || 
            (!tile.isFlagged && !tile.isRevealed && tile.value === "*") ||
            (tile.isFlagged && tile.value !== "*")
                ? {...tile, isAutoRevealed: true}
                : tile
        })))
    }

    function winGame() {
        setEndTime(Date.now())
        setGameStatus("win")
        setMinesLeft(0)
        setCurrent3BV(threeBV)
        setBoard(board.map(row => 
            row.map(tile => tile.value === "*" && !tile.isFlagged
                ? { ...tile, isAutoRevealed: true }
                : tile)))
    }

    function resetBoard() {
        setGameStatus("")
        setBoard(generateTiles())
        setMinesLeft(initialMines)
        setTime(0)
        setUsefulLeftClicks(0)
        setUsefulRightClicks(0)
        setUsefulChords(0)
        setWastedLeftClicks(0)
        setWastedRightClicks(0)
        setWastedChords(0)
        setFinished1stClick(false)
        setFirstRevealedPos(null)
    }
    
    /**
     * Follow-up from resetBoard: set 3BV to new value AFTER board is updated
     */
    React.useEffect(() => {
        if (gameStatus === "") {
            set3BV(find3BV())
        }
    }, [board])

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

    /**
     * If the game is onGoing, have a timer that increments every second
     * If the game is won or lost, stop the timer
     */
    React.useEffect(() => {
        if (gameStatus === "onGoing") {
            const runTimer = setInterval(() => {
                setTime(oldTime => oldTime + 1)
            }, 1000)
            setStartTime(Date.now())
            return () => clearInterval(runTimer)
        }
    }, [gameStatus])

    React.useEffect(() => {
        if (gameStatus === "onGoing") {
            // let firstRevealedPos = null
            // for (let i = 0; i < height; i++) {
            //     for (let j = 0; j < width; j++) {
            //         if (board[i][j].isRevealed && board[i][j].value === "*") {
            //             firstRevealedPos = [i, j]
            //             break
            //         }
            //     }
            // }
            setFinished1stClick(true)
            if (firstRevealedPos) {
                console.log("hi")
                setBoard(generateTiles(firstRevealedPos.row, firstRevealedPos.column))
                setUsefulLeftClicks(0)
            }
        }
    }, [gameStatus])

    React.useEffect(() => {
        if (firstRevealedPos && finished1stClick) {
            // for (let i = 0; i < height; i++) {
            //     for (let j = 0; j < width; j++) {
            //         if (board[i][j].isRevealed) {
            //             board[i][j].value === 0
            //                 ? revealZeroesAroundTile(i, j)
            //                 : revealTile(i, j)
            //         }
            //     }
            // }
            board[firstRevealedPos.row][firstRevealedPos.column].value === 0
                ? revealZeroesAroundTile(firstRevealedPos.row, firstRevealedPos.column)
                : revealTile(firstRevealedPos.row, firstRevealedPos.column)
        }
    }, [finished1stClick])

    /**
     * if we haven't win nor lose the game:
     * if the board contains a revealed mine, the game is lost
     */
    React.useEffect(() => {
        if (finished1stClick && board.some(row => row.some(tile => tile.value === "*" && tile.isRevealed))) {
            if (gameStatus === "onGoing") {
                loseGame()
            }
        }
    }, [board])

    /**
     * if we haven't win nor lose the game:
     * if the all the numbers are revealed, the game is won
     */
    React.useEffect(() => {
        if (gameStatus !== "win" && gameStatus !== "lose" && board.every(row => 
            row.every(tile => tile.value === "*" || tile.isRevealed))) {
            winGame()
        }
    }, [board])

    /**
     * Reset the board if the board properties are changed from the form in
     * Navbar
     */
    React.useEffect(() => {
        resetBoard()
    }, [difficulty, height, width, initialMines])
    
    return (
        <div className="gameBoard--container">
            <Header 
                minesLeft={minesLeft}
                gameStatus={gameStatus}
                resetBoard={resetBoard}
                time={time}
            />
            <Board 
                board={board}
                height={height}
                width={width}
                chord={chord}
                revealZeroesAroundTile={revealZeroesAroundTile}
                revealTile={revealTile}
                flagTile={flagTile}
            />
            {(gameStatus === "win" || gameStatus === "lose") && 
            <GameResult 
                time={usefulLeftClicks + usefulRightClicks + usefulChords + 
                    + wastedLeftClicks + wastedRightClicks + wastedChords === 1
                    ? 0.001
                    : (endTime - startTime) / 1000}
                threeBV={threeBV}
                current3BV={current3BV}
                usefulLeftClicks={usefulLeftClicks}
                usefulRightClicks={usefulRightClicks}
                usefulChords={usefulChords}
                wastedLeftClicks={wastedLeftClicks}
                wastedRightClicks={wastedRightClicks}
                wastedChords={wastedChords}
                showMetricsData={showMetricsData}
                boardProperties={props.boardProperties}
            />}
            <div>ULC: {usefulLeftClicks}</div>
            <div>URC: {usefulRightClicks}</div>
            <div>UC: {usefulChords}</div>
            <div>WLC: {wastedLeftClicks}</div>
            <div>WRC: {wastedRightClicks}</div>
            <div>WC: {wastedChords}</div>
        </div>
    )
}