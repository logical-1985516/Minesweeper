import React from "react"
import Tile from "./components/Tile"
import './style.css'

export default function App() {
    const [board, setBoard] = React.useState(putNumbers())
    
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
            const randomIndex = positions[Math.floor(positions.length * Math.random())]
            const row = Math.floor(randomIndex / 8)
            const col = randomIndex % 8
            minesBoard[row][col] = "*"
            positions = positions.slice(0, randomIndex)
                .concat(positions.slice(randomIndex + 1, positions.length))
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
        // if (newBoard[0][0] === "") {
        //     value = 0
        //     if (newBoard[1][0] === "*") {
        //         value++
        //     }
        //     if (newBoard[0][1] === "*") {
        //         value++
        //     }
        //     if (newBoard[1][1] === "*") {
        //         value++
        //     }
        //     newBoard[0][0] = value
        // }
        // if (newBoard[7][0] === "") {
        //     value = 0
        //     if (newBoard[6][0] === "*") {
        //         value++
        //     }
        //     if (newBoard[7][1] === "*") {
        //         value++
        //     }
        //     if (newBoard[6][1] === "*") {
        //         value++
        //     }
        //     newBoard[7][0] = value
        // }
        // if (newBoard[0][7] === "") {
        //     value = 0
        //     if (newBoard[1][7] === "*") {
        //         value++
        //     }
        //     if (newBoard[0][6] === "*") {
        //         value++
        //     }
        //     if (newBoard[1][6] === "*") {
        //         value++
        //     }
        //     newBoard[0][7] = value
        // }
        // if (newBoard[7][7] === "") {
        //     value = 0
        //     if (newBoard[6][7] === "*") {
        //         value++
        //     }
        //     if (newBoard[7][6] === "*") {
        //         value++
        //     }
        //     if (newBoard[6][6] === "*") {
        //         value++
        //     }
        //     newBoard[6][6] = value
        // }
        // for (let col = 1; col < 7; col++) {
        //     if (newBoard[0][col] === "") {
        //         value = 0
        //         if (newBoard[0][col - 1] === "*") {
        //             value++
        //         }
        //         if (newBoard[0][col + 1] === "*") {
        //             value++
        //         }
        //         if (newBoard[1][col - 1] === "*") {
        //             value++
        //         }
        //         if (newBoard[1][col] === "*") {
        //             value++
        //         }
        //         if (newBoard[1][col + 1] === "*") {
        //             value++
        //         }
        //     }
        // }
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < 8; j++) {
        //         if (newBoard[i][j] !== "*") {
                    
        //         }
        //     }
        // }
    }
    
    // console.log(putMines())
    // console.log(putNumbers())
    
    const numElements = board.map(row => row.map(tile => <div className="app--tile">{tile}</div>))
    
    return (
        <div>
            <nav className="app--nav">
                <div className="app--mine-counter">Mines left: 10</div>
                <button className="app--game-button">Start/end game</button>
                <div className="app--stopwatch">Time: 0</div>
            </nav>
            <main className="app--main">
                <div className="app--board-container">
                    {numElements}
                </div>
            </main>
        </div>
    )
}