import React from "react"
import OldGameResult from "./OldGameResult"
import LabelAndDropdown from "./LabelAndDropdown"
import { resultsCollection } from "../firebase"
import { onSnapshot, query, where, orderBy } from "firebase/firestore"

export default function AllGamesPlayed(props) {
    const showMetricsData = props.showMetricsData
    const advancedMetrics = generateAdvancedMetrics()
    const [gamesResults, setGamesResults] = React.useState("")
    const [oldGamesFontSize, setOldGamesFontSize] = React.useState(
        JSON.parse(localStorage.getItem("oldGamesFontSize")) || 16
    )
    const [showDropdown, setShowDropdown] = React.useState("")
    const [outcomeFilter, setOutcomeFilter] = React.useState("All")
    const [gameModeFilter, setGameModeFilter] = React.useState("All")
    const [difficultyFilter, setDifficultyFilter] = React.useState("All")
    const [sortBy, setSortBy] = React.useState("Date")
    const [boardFilter, setBoardFilter] = React.useState({
        height: "All",
        width: "All",
        mines: "All"
    })
    const [newBoardFilter, setNewBoardFilter] = React.useState({
        height: "",
        width: "",
        mines: ""
    })

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

    function generateAdvancedMetrics() {
        const result = []
        showMetricsData.showRQP && result.push("RQP")
        showMetricsData.showIOS && result.push("IOS")
        showMetricsData.showClicksPerSecond && result.push("Clicks/s")
        showMetricsData.showUsefulClicksPerSecond && result.push("Useful Clicks/s")
        showMetricsData.showThroughput && result.push("Throughput")
        showMetricsData.showCorrectness && result.push("Correctness")
        return result
    }

    function toggleDropdown(name) {
        showDropdown === name
            ? setShowDropdown("")
            : setShowDropdown(name)
    }

    function dropdownEvent(name, value, setStateFunction) {
        setStateFunction(value)
        toggleDropdown(name)
    }

    function handleChange(event) {
        const {name, value} = event.target
        setNewBoardFilter(oldNewBoardFilter => ({...oldNewBoardFilter, [name]: value}))
    }

    function handleSubmit(event) {
        event.preventDefault()
        setBoardFilter({
            height: newBoardFilter.height ? Number(newBoardFilter.height) : "All",
            width: newBoardFilter.width ? Number(newBoardFilter.width) : "All",
            mines: newBoardFilter.mines ? Number(newBoardFilter.mines) : "All"
        })
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

    function sortFunction(metric) {
        if (!gamesResults || sortBy === "Date" || sortBy === "Time") {
            return
        }
        const fieldName = metric === "Estimated Time"
            ? "estimatedTime"
            : metric === "3BV/s"
            ? "threeBVPerSecond"
            : metric === "Efficiency"
            ? "efficiency"
            : metric === "RQP"
            ? "RQP"
            : metric === "IOS"
            ? "IOS"
            : metric === "Clicks/s"
            ? "clicksPerSecond"
            : metric === "Useful Clicks/s"
            ? "usefulClicksPerSecond"
            : metric === "Throughput"
            ? "throughput"
            : metric === "Correctness"
            ? "correctness"
            : metric === "Total 3BV"
            ? "threeBV"
            : metric === "Current 3BV"
            ? "current3BV"
            : metric === "Game Progress"
            ? "gameProgress"
            : metric === "Clicks"
            ? "clicks"
            : metric === "Useful Clicks"
            ? "usefulClicks"
            : "wastedClicks"
        return ["estimatedTime"].includes(fieldName)
            ? (object1, object2) => object1[fieldName] - object2[fieldName]
            : (object1, object2) => object2[fieldName] - object1[fieldName]
    }

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
            clicks: totalClicks,
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

    const filterByOutcome = gamesResults && oldGameResults.filter(oldGameResult => 
        outcomeFilter === "All" || oldGameResult.outcome === outcomeFilter)
    const filterByHeight = gamesResults && filterByOutcome.filter(oldGameResult =>
        boardFilter.height === "All" || oldGameResult.height === boardFilter.height)
    const filterByWidth = gamesResults && filterByHeight.filter(oldGameResult =>
        boardFilter.width === "All" || oldGameResult.width === boardFilter.width)
    console.log(filterByWidth)
    const filterByMines = gamesResults && filterByWidth.filter(oldGameResult =>
        boardFilter.mines === "All" || oldGameResult.mines === boardFilter.mines)
        .sort(sortFunction(sortBy))
    // (gamesResults && sortBy !== "Date" && sortBy !== "Time") && filterByMines.sort(sortFunction(sortBy))

    const oldGameResultElements = gamesResults && filterByMines.map(oldGameResult =>
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
                labelName="Table Font Size"
                state={oldGamesFontSize}
                toggleDropdown={toggleDropdown}
                dropdownName={"fontSize"}
                showDropdown={showDropdown}
                items={[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]}
                setStateFunction={setOldGamesFontSize}
            /> 
            <div>
                <div>
                    <div style={{marginBottom: "5px", textDecoration: "underline"}}>Filters</div>
                    <LabelAndDropdown
                        dropdownEvent={dropdownEvent}
                        labelName="Outcome"
                        state={outcomeFilter}
                        toggleDropdown={toggleDropdown}
                        dropdownName={"outcomeFilter"}
                        showDropdown={showDropdown}
                        items={["All", "Win", "Loss"]}
                        setStateFunction={setOutcomeFilter}
                    />
                    <LabelAndDropdown
                        dropdownEvent={dropdownEvent}
                        labelName="Game Mode"
                        state={gameModeFilter}
                        toggleDropdown={toggleDropdown}
                        dropdownName={"gameModeFilter"}
                        showDropdown={showDropdown}
                        items={["All", "Classic", "To be added"]}
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
                    <form onSubmit={handleSubmit} style={{marginBottom: "5px"}}>
                        <label htmlFor="height">Height: {boardFilter.height}</label>
                        <input 
                            id="height"
                            name="height"
                            type="number"
                            value={newBoardFilter.height}
                            onChange={handleChange}
                            min={1}
                            max={30}
                            step={1}
                            className="changeBoard--input"
                        />
                        <label htmlFor="width">Width: {boardFilter.width}</label>
                        <input 
                            id="width"
                            name="width"
                            type="number"
                            value={newBoardFilter.width}
                            onChange={handleChange}
                            min={1}
                            max={30}
                            step={1}
                            className="changeBoard--input"
                        />
                        <label htmlFor="mines">Mines: {boardFilter.mines}</label>
                        <input 
                            id="mines"
                            name="mines"
                            type="number"
                            value={newBoardFilter.mines}
                            onChange={handleChange}
                            min={1}
                            max={newBoardFilter.height && newBoardFilter.width
                                    ? newBoardFilter.height * newBoardFilter.width - 1
                                    : newBoardFilter.height
                                    ? newBoardFilter.height * 30 - 1
                                    : newBoardFilter.width
                                    ? newBoardFilter.width * 30 - 1
                                    : 899}
                            step={1}
                            className="changeBoard--input"
                        />
                        <button>Update</button>
                        <span style={{marginLeft: "10px"}}>Note: leave fields blank to set to "All"</span>
                    </form>
                </div>
                <LabelAndDropdown
                    dropdownEvent={dropdownEvent}
                    labelName="Sort By"
                    state={sortBy}
                    toggleDropdown={toggleDropdown}
                    dropdownName={"sortBy"}
                    showDropdown={showDropdown}
                    items={(["Date", "Time", "Estimated Time", "3BV/s", "Efficiency"]
                        .concat(advancedMetrics))
                        .concat(["Total 3BV", "Current 3BV", "Game Progress", "Clicks", 
                        "Useful Clicks", "Wasted Clicks"])}
                    setStateFunction={setSortBy}
                />
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