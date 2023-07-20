import React from "react"
import Tile from "./Tile"
import {nanoid} from "nanoid"

export default function Board(props) {
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

    const tileElements = props.board.map(row => row.map(tile => <Tile 
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
                ? props.chord(tile.row, tile.column)
                : tile.value === 0
                ? props.revealZeroesAroundTile(tile.row, tile.column)
                : props.revealTile(tile.id)
        }}
        isFlagged={tile.isFlagged}
        flagTile={() => {
            return tile.isRevealed
                ? null
                : props.flagTile(tile.id)
        }}
    />))

    return (
        <main className="app--main">
            <div className="app--board-container">
                {tileElements}
            </div>
        </main>
    )
}