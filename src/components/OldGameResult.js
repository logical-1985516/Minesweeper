import React from "react"

export default function OldGameResult(props) {
    const showMetricsData = props.showMetricsData
    const data = props.gameResult
    const width = data.width
    const height = data.board.length / width
    const newBoard = createBoard()
    const mines = findMines()
    const threeBV = find3BV()
    const current3BV = findCurrent3BV()
    const correctFlags = findCorrectFlags()

    function createBoard() {
        const newBoard = []
        let curr = 0
        for (let i = 0; i < height; i++) {
            newBoard.push([])
            for (let j = 0; j < width; j++) {
                newBoard[i].push(data.board[curr])
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

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    const gameProgress = current3BV / threeBV
    const usefulClicks = data.usefulLeftClicks + data.usefulRightClicks + data.usefulChords
    const wastedClicks = data.wastedLeftClicks + data.wastedRightClicks + data.wastedChords
    const totalClicks = usefulClicks + wastedClicks
    const threeBVPerSecond = current3BV / data.time
    const RQP = data.time / threeBVPerSecond
    const IOS = Math.log(threeBVPerSecond) / Math.log(data.time)
    const clicksPerSecond = totalClicks / data.time
    const usefulClicksPerSecond = usefulClicks / data.time
    const efficiency = current3BV / totalClicks
    const throughput = current3BV / usefulClicks
    const correctness = usefulClicks / totalClicks
    const date = new Date(data.date)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", 
        "September", "October", "November", "December"];
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return (
        <tr>
            <td>
                <button onClick={() => retrieveGameData(newBoard, data.difficulty,
                        height, width, mines, correctFlags, data.time, threeBV, current3BV, 
                        data.usefulLeftClicks, data.usefulRightClicks, data.usefulChords, 
                        data.wastedLeftClicks, data.wastedRightClicks, data.wastedChords)}>
                    View
                </button>
            </td>
            <td>{data.gameMode}</td>
            <td>{data.difficulty}</td>
            <td>{height}x{width}/{mines}</td>
            <td>{data.time}s</td>
            <td>{Math.round(1000 * data.time * threeBV / current3BV) / 1000}s</td>
            <td>{current3BV}/{threeBV} ({Math.round(100 * gameProgress)}%)</td>
            <td>{usefulClicks} ({data.usefulLeftClicks} + {data.usefulRightClicks} + {data.usefulChords})</td>
            <td>{wastedClicks} (
                {data.wastedLeftClicks} + {data.wastedRightClicks} + {data.wastedChords})</td>
            <td>{totalClicks}</td>
            <td>{Math.round(1000 * threeBVPerSecond) / 1000}</td>
            {showMetricsData.showRQP && <td>{Math.round(1000 * RQP) / 1000}</td>}
            {showMetricsData.showIOS && <td>{Math.round(1000 * IOS) / 1000}</td>}
            {showMetricsData.showClicksPerSecond && 
                <td>{Math.round(1000 * clicksPerSecond) / 1000}</td>}
            {showMetricsData.showUsefulClicksPerSecond && 
                <td>{Math.round(1000 * usefulClicksPerSecond) / 1000}</td>}
            <td>{Math.round(100 * efficiency)}%</td>
            {showMetricsData.showThroughput && <td>{Math.round(100 * throughput)}%</td>}
            {showMetricsData.showCorrectness && <td>{Math.round(100 * correctness)}%</td>}
            <td>{`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()
                } ${date.getHours()}:${minutes}:${seconds}`}</td>
            {/* <td>{date.toString().slice(4, 24)}</td> */}
        </tr>
    )
}