import React from "react"
import OldGameResult from "./OldGameResult"
import LabelAndDropdown from "./LabelAndDropdown"
import { nanoid } from "nanoid"
import { resultsCollection } from "../firebase"
import { onSnapshot, query, where, orderBy } from "firebase/firestore"

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
    const [sortBy, setSortBy] = React.useState("Date")
    //const [gameModes, setGameModes] = React.useState("")
    // const q = outcomeFilter === "All" 
    //     ? resultsCollection
    //     : query(resultsCollection, where("outcome", "==", outcomeFilter))

    const filterByGameMode = gameModeFilter === "All"
        ? resultsCollection
        : query(resultsCollection, where("gameMode", "==", gameModeFilter))
    const filterByDifficulty = difficultyFilter === "All"
        ? filterByGameMode
        : query(filterByGameMode, where("difficulty", "==", difficultyFilter))
    const sorted = sortBy === "Time"
        ? query(filterByDifficulty, orderBy("time"))
        : filterByDifficulty
    const sortedResults = query(sorted, orderBy("date", "desc"))

    React.useEffect(() => {
        const unsubscribe = onSnapshot(sortedResults, snapshot => {
            const resultsArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setGamesResults(resultsArr)
        })
        return unsubscribe
    }, [gameModeFilter, difficultyFilter, sortBy])

    function toggleDropdown(name) {
        showDropdown === name
            ? setShowDropdown("")
            : setShowDropdown(name)
    }

    function dropdownEvent(name, value, setStateFunction) {
        setStateFunction(value)
        toggleDropdown(name)
    }

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    React.useEffect(() => {
        localStorage.setItem("oldGamesFontSize", oldGamesFontSize)
    }, [oldGamesFontSize])

    // const changeFontSizeElements = generateDropdownElements("fontSize",
    //     [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24], oldGamesFontSize, setOldGamesFontSize)

    // const difficultyFilterElements = generateDropdownElements("difficultyFilter", 
    //     ["All", "Beginner", "Intermediate", "Expert", "Custom"], difficultyFilter, 
    //     setDifficultyFilter)

    // const sortByElements = generateDropdownElements("sortBy", 
    //     ["Date", "Time"], sortBy, setSortBy)

    const oldGameResults = gamesResults && gamesResults.map(gameResult => {
        const width = gameResult.width
        const height = gameResult.board.length / gameResult.width
        const newBoard = createBoard(gameResult.board, height, width)
        const mines = findMines(newBoard)
        const threeBV = find3BV(newBoard)
        const current3BV = findCurrent3BV(newBoard)
        const gameProgress = current3BV / threeBV
        const usefulClicks = gameResult.usefulLeftClicks + gameResult.usefulRightClicks + 
            gameResult.usefulChords
        const wastedClicks = gameResult.wastedLeftClicks + gameResult.wastedRightClicks + 
            gameResult.wastedChords
        const totalClicks = usefulClicks + wastedClicks
        const threeBVPerSecond = current3BV / gameResult.time
        const RQP = gameResult.time / threeBVPerSecond
        const IOS = Math.log(threeBVPerSecond) / Math.log(gameResult.time)
        const clicksPerSecond = totalClicks / gameResult.time
        const usefulClicksPerSecond = usefulClicks / gameResult.time
        const efficiency = current3BV / totalClicks
        const throughput = current3BV / usefulClicks
        const correctness = usefulClicks / totalClicks
        const date = gameResult.date
        const correctFlags = findCorrectFlags()
        function createBoard() {
            const newBoard = []
            let curr = 0
            for (let i = 0; i < height; i++) {
                newBoard.push([])
                for (let j = 0; j < width; j++) {
                    newBoard[i].push(gameResult.board[curr])
                    curr++
                }
            }
            return newBoard
        }
    
        function findMines() {
            let mines = 0
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (newBoard[i][j].value === "*") {
                        mines++
                    }
                }
            }
            return mines
        }

        function findCorrectFlags() {
            if (threeBV === current3BV) {
                return mines
            }
            let correctFlags = 0
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (newBoard[i][j].isFlagged && newBoard[i][j].value === "*") {
                        correctFlags++
                    }
                }
            }
            return correctFlags
        }
    
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
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (newBoard[i][j].value === 0 && !visited[i][j]) {
                        DFS(i, j)
                        threeBV++
                    }
                }
            }
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (!visited[i][j] && newBoard[i][j].value !== "*") {
                        threeBV++
                    }
                }
            }
            return threeBV
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
                if (newBoard[row][col].isRevealed) {
                    visitedRevealed = true
                }
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
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (newBoard[i][j].value === 0 && !visited[i][j]) {
                        visitedRevealed = false
                        DFS(i, j)
                        visitedRevealed && threeBV++
                    }
                }
            }
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (!visited[i][j] && newBoard[i][j].value !== "*" && newBoard[i][j].isRevealed) {
                        threeBV++
                    }
                }
            }
            return threeBV
        }
        return {
            key: gameResult.id,
            board: newBoard,
            outcome: current3BV === threeBV ? "Win" : "Loss",
            gameMode: gameResult.gameMode,
            difficulty: gameResult.difficulty,
            height: height,
            width: width,
            mines: mines,
            time: gameResult.time,
            estimatedTime: gameResult.time / gameProgress,
            current3BV: current3BV,
            threeBV: threeBV,
            gameProgress: gameProgress,
            usefulClicks: usefulClicks,
            usefulLeftClicks: gameResult.usefulLeftClicks,
            usefulRightClicks: gameResult.usefulRightClicks,
            usefulChords: gameResult.usefulChords,
            wastedClicks: wastedClicks,
            wastedLeftClicks: gameResult.wastedLeftClicks,
            wastedRightClicks: gameResult.wastedRightClicks,
            wastedChords: gameResult.wastedChords,
            threeBVPerSecond: threeBVPerSecond,
            efficiency: efficiency,
            RQP: RQP,
            IOS: IOS,
            clicksPerSecond: clicksPerSecond,
            usefulClicksPerSecond: usefulClicksPerSecond,
            throughput: throughput,
            correctness: correctness,
            date: date,
            correctFlags: correctFlags
    }})

    const oldGameResultElements = gamesResults && oldGameResults.map(oldGameResult =>
        <OldGameResult 
            key={oldGameResult.key}
            board={oldGameResult.board}
            outcome={oldGameResult.outcome}
            gameMode={oldGameResult.gameMode}
            difficulty={oldGameResult.difficulty}
            height={oldGameResult.height}
            width={oldGameResult.width}
            mines={oldGameResult.mines}
            time={oldGameResult.time}
            estimatedTime={oldGameResult.estimatedTime}
            current3BV={oldGameResult.current3BV}
            threeBV={oldGameResult.threeBV}
            gameProgress={oldGameResult.gameProgress}
            usefulClicks={oldGameResult.usefulClicks}
            usefulLeftClicks={oldGameResult.usefulLeftClicks}
            usefulRightClicks={oldGameResult.usefulRightClicks}
            usefulChords={oldGameResult.usefulChords}
            wastedClicks={oldGameResult.wastedClicks}
            wastedLeftClicks={oldGameResult.wastedLeftClicks}
            wastedRightClicks={oldGameResult.wastedRightClicks}
            wastedChords={oldGameResult.wastedChords}
            threeBVPerSecond={oldGameResult.threeBVPerSecond}
            efficiency={oldGameResult.efficiency}
            RQP={oldGameResult.RQP}
            IOS={oldGameResult.IOS}
            clicksPerSecond={oldGameResult.clicksPerSecond}
            usefulClicksPerSecond={oldGameResult.usefulClicksPerSecond}
            throughput={oldGameResult.throughput}
            correctness={oldGameResult.correctness}
            date={oldGameResult.date}
            correctFlags={oldGameResult.correctFlags}
            showMetricsData={showMetricsData}
            retrieveGameData={retrieveGameData}
        />
    )

    const styles = {
        fontSize: `${oldGamesFontSize}px`
    }

    return (
        <div>
            <LabelAndDropdown
                dropdownEvent={dropdownEvent}
                labelName="Font Size"
                state={oldGamesFontSize}
                toggleDropdown={toggleDropdown}
                dropdownName={"fontSize"}
                showDropdown={showDropdown}
                items={[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]}
                setStateFunction={setOldGamesFontSize}
            />
            {/* <div style={{marginBottom: "10px"}}>
                <div className="label-and-dropdown">
                    <span>Font Size: {oldGamesFontSize}</span>
                    <div>
                        <button onClick={() => toggleDropdown("fontSize")}>Select</button>
                        {showDropdown === "fontSize" && <div className="dropdown-container">
                            {changeFontSizeElements}
                        </div>}
                    </div>
                </div>
            </div> */}
            <div>
                <div>
                    <div style={{marginBottom: "5px", textDecoration: "underline"}}>Filters</div>
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
                    <LabelAndDropdown
                        dropdownEvent={dropdownEvent}
                        labelName="Game Mode"
                        state={gameModeFilter}
                        toggleDropdown={toggleDropdown}
                        dropdownName={"gameModeFilter"}
                        showDropdown={showDropdown}
                        items={["All", "Classic", "newGameMode"]}
                        setStateFunction={setGameModeFilter}
                    />
                    <LabelAndDropdown
                        dropdownEvent={dropdownEvent}
                        labelName="Difficulty"
                        state={difficultyFilter}
                        toggleDropdown={toggleDropdown}
                        dropdownName={"difficultyFilter"}
                        showDropdown={showDropdown}
                        items={["All", "Beginner", "Intermediate", "Expert", "Custom"]}
                        setStateFunction={setDifficultyFilter}
                    />
                    {/* <div style={{marginBottom: "5px"}}>
                        <div className="label-and-dropdown">
                            <span>Game Mode: {gameModeFilter}</span>
                            <div>
                                <button onClick={() => toggleDropdown("gameModeFilter")}>Select</button>
                                {showDropdown === "gameModeFilter" && <div className="dropdown-container">
                                    {gameModeFilterElements}
                                </div>}
                            </div>
                        </div>
                    </div> */}
                    {/* <div style={{marginBottom: "5px"}}>
                        <div className="label-and-dropdown">
                            <span>Difficulty: {difficultyFilter}</span>
                            <div>
                                <button onClick={() => toggleDropdown("difficultyFilter")}>Select</button>
                                {showDropdown === "difficultyFilter" && <div className="dropdown-container">
                                    {difficultyFilterElements}
                                </div>}
                            </div>
                        </div>
                    </div> */}
                </div>
                <LabelAndDropdown
                    dropdownEvent={dropdownEvent}
                    labelName="Sort By"
                    state={sortBy}
                    toggleDropdown={toggleDropdown}
                    dropdownName={"sortBy"}
                    showDropdown={showDropdown}
                    items={["Date", "Time"]}
                    setStateFunction={setSortBy}
                />
                {/* <div style={{marginBottom: "5px"}}>
                    <div className="label-and-dropdown">
                        <span>Sort By: {sortBy}</span>
                        <div>
                            <button onClick={() => toggleDropdown("sortBy")}>Select</button>
                            {showDropdown === "sortBy" && <div className="dropdown-container">
                                {sortByElements}    
                            </div>}
                        </div>
                    </div>
                </div>  */}
            </div>
            <table style={styles}>
                <thead>
                    <tr>
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
                    </tr>
                </thead>
                <tbody>
                    {oldGameResultElements}
                </tbody>
            </table>
        </div>
    )
}