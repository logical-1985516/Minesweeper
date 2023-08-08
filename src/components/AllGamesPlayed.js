import React from "react"
import OldGameResult from "./OldGameResult"
import { nanoid } from "nanoid"
import { resultsCollection } from "../firebase"
import { onSnapshot, getDocs, query, where, orderBy, and } from "firebase/firestore"

export default function AllGamesPlayed(props) {
    const showMetricsData = props.showMetricsData
    const [gamesResults, setGamesResults] = React.useState("")
    const [oldGamesFontSize, setOldGamesFontSize] = React.useState(
        JSON.parse(localStorage.getItem("oldGamesFontSize")) || 16
    )
    const [showDropdown, setShowDropdown] = React.useState("")
    const [outcomeFilter, setOutcomeFilter] = React.useState("All")
    const [gameModeFilter, setGameModeFilter] = React.useState("All")
    const [difficultyFilter, setDifficultyFilter] = React.useState("All")
    //const [gameModes, setGameModes] = React.useState("")
    // const q = outcomeFilter === "All" 
    //     ? resultsCollection
    //     : query(resultsCollection, where("outcome", "==", outcomeFilter))

    const sortedResults = query(resultsCollection, orderBy("date", "desc"))
    const filterByGameMode = gameModeFilter === "All"
        ? sortedResults
        : query(sortedResults, where("gameMode", "==", gameModeFilter))
    const filterByDifficulty = difficultyFilter === "All"
        ? filterByGameMode
        : query(filterByGameMode, where("difficulty", "==", difficultyFilter))

    React.useEffect(() => {
        const unsubscribe = onSnapshot(filterByDifficulty, snapshot => {
            const resultsArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setGamesResults(resultsArr)
        })
        return unsubscribe
    }, [gameModeFilter, difficultyFilter])

    function toggleDropdown(name) {
        showDropdown === name
            ? setShowDropdown("")
            : setShowDropdown(name)
    }

    function changeOldGamesFontSize(newFontSize) {
        setOldGamesFontSize(newFontSize)
        toggleDropdown("fontSize")
    }

    function changeGameModeFilter(newGameMode) {
        setGameModeFilter(newGameMode)
        toggleDropdown("gameModeFilter")
    }

    function changeDifficultyFilter(newDifficulty) {
        setDifficultyFilter(newDifficulty)
        toggleDropdown("difficultyFilter")
    }

    function changeOutcomeFilter(newOutcome) {
        setOutcomeFilter(newOutcome)
        toggleDropdown("outcomeFilter")
    }

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    const fontSizes = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]

    React.useEffect(() => {
        localStorage.setItem("oldGamesFontSize", oldGamesFontSize)
    }, [oldGamesFontSize])

    const changeFontSizeElements = fontSizes.map(fontsize =>
        <div key={nanoid()}
            onClick={() => changeOldGamesFontSize(fontsize)}
            style={{backgroundColor: fontsize === oldGamesFontSize ? "lightblue" : "none"}}
            className="dropdown-item">{fontsize}</div>)

    const gameModeFilterElements = ["All", "Classic", "newGameMode"].map(gameMode =>
        <div key={nanoid()}
        onClick={() => changeGameModeFilter(gameMode)}
        style={{backgroundColor: gameMode === gameModeFilter ? "lightblue" : "none"}}
        className="dropdown-item">{gameMode}</div>)

    const difficultyFilterElements = ["All", "Beginner", "Intermediate", 
        "Expert", "Custom"].map(difficulty =>
        <div key={nanoid()}
        onClick={() => changeDifficultyFilter(difficulty)}
        style={{backgroundColor: difficulty === difficultyFilter ? "lightblue" : "none"}}
        className="dropdown-item">{difficulty}</div>)

    // const outcomeFilterElements = ["All", "Win", "Loss"].map(outcome => 
    //     <div key={nanoid()}
    //         onClick={() => changeOutcomeFilter(outcome)}
    //         style={{backgroundColor: outcome === outcomeFilter ? "lightblue" : "none"}}
    //         className="dropdown-item">{outcome}</div>)

    // function createBoard(boardData, height, width) {
    //     const newBoard = []
    //     let curr = 0
    //     for (let i = 0; i < height; i++) {
    //         newBoard.push([])
    //         for (let j = 0; j < width; j++) {
    //             newBoard[i].push(boardData[curr])
    //             curr++
    //         }
    //     }
    //     return newBoard
    // }

    // function findMines(newBoard) {
    //     let mines = 0
    //     for (let i = 0; i < newBoard.length; i++) {
    //         for (let j = 0; j < newBoard[0].length; j++) {
    //             if (newBoard[i][j].value === "*") {
    //                 mines++
    //             }
    //         }
    //     }
    //     return mines
    // }

    // function findCorrectFlags(newBoard) {
    //     if (threeBV === current3BV) {
    //         return mines
    //     }
    //     let correctFlags = 0
    //     for (let i = 0; i < newBoard.length; i++) {
    //         for (let j = 0; j < newBoard[0].length; j++) {
    //             if (newBoard[i][j].isFlagged && newBoard[i][j].value === "*") {
    //                 correctFlags++
    //             }
    //         }
    //     }
    //     return correctFlags
    // }

    // const oldGameResults = gamesResults.map(gameResult => {
    //     const width = gameResult.width
    //     const height = gameResult.board.length / gameResult.width
    //     const newBoard = createBoard(gameResult.board, height, width)
    //     const mines = findMines(newBoard)
    //     const threeBV = find3BV(newBoard)
    //     const current3BV = findCurrent3BV(newBoard)
    //     const correctFlags = findCorrectFlags(newBoard)
    //     function createBoard() {
    //         const newBoard = []
    //         let curr = 0
    //         for (let i = 0; i < height; i++) {
    //             newBoard.push([])
    //             for (let j = 0; j < width; j++) {
    //                 newBoard[i].push(gameResult.board[curr])
    //                 curr++
    //             }
    //         }
    //         return newBoard
    //     }
    
    //     function findMines() {
    //         let mines = 0
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (newBoard[i][j].value === "*") {
    //                     mines++
    //                 }
    //             }
    //         }
    //         return mines
    //     }
    
    //     function findCorrectFlags() {
    //         if (threeBV === current3BV) {
    //             return mines
    //         }
    //         let correctFlags = 0
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (newBoard[i][j].isFlagged && newBoard[i][j].value === "*") {
    //                     correctFlags++
    //                 }
    //             }
    //         }
    //         return correctFlags
    //     }
    
    //     function find3BV() {
    //         const visited = []
    //         let threeBV = 0
    //         for (let i = 0; i < height; i++) {
    //             visited.push([])
    //             for (let j = 0; j < width; j++) {
    //                 visited[i].push(false)
    //             }
    //         }
    //         function DFS(row, col) {
    //             if (row < 0 || row === height || col < 0 || col === width ||
    //                 visited[row][col]) {
    //                 return
    //             }
    //             visited[row][col] = true
    //             if (newBoard[row][col].value === 0) {
    //                 DFS(row - 1, col - 1)
    //                 DFS(row, col - 1)
    //                 DFS(row + 1, col - 1)
    //                 DFS(row - 1, col)
    //                 DFS(row + 1, col)
    //                 DFS(row - 1, col + 1)
    //                 DFS(row, col + 1)
    //                 DFS(row + 1, col + 1)
    //             }
    //         }
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (newBoard[i][j].value === 0 && !visited[i][j]) {
    //                     DFS(i, j)
    //                     threeBV++
    //                 }
    //             }
    //         }
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (!visited[i][j] && newBoard[i][j].value !== "*") {
    //                     threeBV++
    //                 }
    //             }
    //         }
    //         return threeBV
    //     }
    
    //     function findCurrent3BV() {
    //         const visited = []
    //         let threeBV = 0
    //         let visitedRevealed = false
    //         for (let i = 0; i < height; i++) {
    //             visited.push([])
    //             for (let j = 0; j < width; j++) {
    //                 visited[i].push(false)
    //             }
    //         }
    //         function DFS(row, col) {
    //             if (row < 0 || row === height || col < 0 || col === width ||
    //                 visited[row][col]) {
    //                 return
    //             }
    //             visited[row][col] = true
    //             if (newBoard[row][col].isRevealed) {
    //                 visitedRevealed = true
    //             }
    //             if (newBoard[row][col].value === 0) {
    //                 DFS(row - 1, col - 1)
    //                 DFS(row, col - 1)
    //                 DFS(row + 1, col - 1)
    //                 DFS(row - 1, col)
    //                 DFS(row + 1, col)
    //                 DFS(row - 1, col + 1)
    //                 DFS(row, col + 1)
    //                 DFS(row + 1, col + 1)
    //             }
    //         }
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (newBoard[i][j].value === 0 && !visited[i][j]) {
    //                     visitedRevealed = false
    //                     DFS(i, j)
    //                     visitedRevealed && threeBV++
    //                 }
    //             }
    //         }
    //         for (let i = 0; i < height; i++) {
    //             for (let j = 0; j < width; j++) {
    //                 if (!visited[i][j] && newBoard[i][j].value !== "*" && newBoard[i][j].isRevealed) {
    //                     threeBV++
    //                 }
    //             }
    //         }
    //         return threeBV
    //     }
    //     return {
    //         outcome: current3BV === threeBV ? "Win" : "Loss",

    // }})

    const oldGameResultElements = gamesResults && gamesResults.map(gameResult => 
        <OldGameResult 
            key={gameResult.id}
            gameResult={gameResult}
            showMetricsData={showMetricsData}
            retrieveGameData={retrieveGameData}
        />
    )

    const styles = {
        fontSize: `${oldGamesFontSize}px`
    }

    return (
        <div>
            <div style={{marginBottom: "10px"}}>
                <div className="label-and-dropdown">
                    <span>Font Size: {oldGamesFontSize}</span>
                    <div>
                        <button onClick={() => toggleDropdown("fontSize")}>Select</button>
                        {showDropdown === "fontSize" && <div className="dropdown-container">
                            {changeFontSizeElements}
                        </div>}
                    </div>
                </div>
            </div>
            <div>
                <div style={{marginBottom: "10px", textDecoration: "underline"}}>Filters</div>
                {/* <div style={{marginBottom: "5px"}}>
                    <div className="label-and-dropdown">
                        <span>Outcome: {outcomeFilter}</span>
                        <div>
                            <button onClick={() => toggleDropdown("outcomeFilter")}>Select</button>
                            {showDropdown === "outcomeFilter" && <div className="dropdown-container">
                                {outcomeFilterElements}
                            </div>}
                        </div>
                    </div>
                </div> */}
                <div style={{marginBottom: "5px"}}>
                    <div className="label-and-dropdown">
                        <span>Game Mode: {gameModeFilter}</span>
                        <div>
                            <button onClick={() => toggleDropdown("gameModeFilter")}>Select</button>
                            {showDropdown === "gameModeFilter" && <div className="dropdown-container">
                                {gameModeFilterElements}
                            </div>}
                        </div>
                    </div>
                </div>
                <div style={{marginBottom: "5px"}}>
                    <div className="label-and-dropdown">
                        <span>Difficulty: {difficultyFilter}</span>
                        <div>
                            <button onClick={() => toggleDropdown("difficultyFilter")}>Select</button>
                            {showDropdown === "difficultyFilter" && <div className="dropdown-container">
                                {difficultyFilterElements}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <table style={styles}>
                <th>View</th>
                <th>Outcome</th>
                <th>Game Mode</th>
                <th>Difficulty</th>
                <th>Board</th>
                <th>Time</th>
                <th>Est Time</th>
                <th>3BV</th>
                <th>Useful Clicks</th>
                <th>Wasted Clicks</th>
                <th>Clicks</th>
                <th>3BV/s</th>
                {showMetricsData.showRQP &&<th>RQP</th>}
                {showMetricsData.showIOS && <th>IOS</th>}
                {showMetricsData.showClicksPerSecond && <th>CL/s</th>}
                {showMetricsData.showUsefulClicksPerSecond && <th>UCL/s</th>}
                <th>Eff</th>
                {showMetricsData.showThroughput && <th>Thrp</th>}
                {showMetricsData.showCorrectness && <th>Corr</th>}
                <th>Date</th>
                {oldGameResultElements}
            </table>
        </div>
    )
}