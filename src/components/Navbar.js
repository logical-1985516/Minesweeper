import React from "react"

export default function Navbar(props) {
    const [itemOpen, setItemOpen] = React.useState("")
    const [boardProperties, setBoardProperties] = React.useState({
        difficulty: "",
        height: "",
        width: "",
        mines: ""
    })

    function toggleShowBoardSize() {
        itemOpen === "boardSize"
            ? setItemOpen("")
            : setItemOpen("boardSize")
    }

    function toggleShowSettings() {
        itemOpen === "settings"
            ? setItemOpen("")
            : setItemOpen("settings")
    }

    function handleChange(event) {
        const {name, value} = event.target
        setBoardProperties(oldBoardProperties => {
            return {...oldBoardProperties, [name]: value}
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(boardProperties)
        if (boardProperties.height > 0 && boardProperties.height <= 30 &&
            boardProperties.width > 0 && boardProperties.width <= 30 &&
            boardProperties.mines > 0 &&
            boardProperties.mines < boardProperties.height * boardProperties.width) {
            props.changeBoardProperties(boardProperties.height, 
                boardProperties.width, boardProperties.mines)
        }
    }

    React.useEffect(() => {
        if (boardProperties.difficulty === "Beginner") {
            boardProperties.height = 8
            boardProperties.width = 8
            boardProperties.mines = 10
        }
        if (boardProperties.difficulty === "Intermediate") {
            boardProperties.height = 16
            boardProperties.width = 16
            boardProperties.mines = 40
        }
        if (boardProperties.difficulty === "Expert") {
            boardProperties.height = 16
            boardProperties.width = 30
            boardProperties.mines = 99
        }
    }, [boardProperties])

    return (
        <nav>
            <span>Minesweeper</span>
            <button onClick={toggleShowBoardSize}>Change Board Size</button>
            <button onClick={toggleShowSettings}>Settings</button>
            {itemOpen === "boardSize" && 
            <form onSubmit={handleSubmit}>
                <input
                    type="radio"
                    id="Beginner"
                    name="difficulty"
                    value="Beginner"
                    checked={boardProperties.difficulty === "Beginner"}
                    onChange={handleChange}
                />
                <label htmlFor="Beginner">Beginner</label>
                <br />
                <input
                    type="radio"
                    id="Intermediate"
                    name="difficulty"
                    value="Intermediate"
                    checked={boardProperties.difficulty === "Intermediate"}
                    onChange={handleChange}
                />
                <label htmlFor="Intermediate">Intermediate</label>
                <br />
                <input
                    type="radio"
                    id="Expert"
                    name="difficulty"
                    value="Expert"
                    checked={boardProperties.difficulty === "Expert"}
                    onChange={handleChange}
                />
                <label htmlFor="Expert">Expert</label>
                <br />
                <input
                    type="radio"
                    id="Custom"
                    name="difficulty"
                    value="Custom"
                    checked={boardProperties.difficulty === "Custom"}
                    onChange={handleChange}
                />
                <label htmlFor="Custom">Custom</label>
                <label htmlFor="height">Height</label>
                <input 
                    type="number"
                    id="height"
                    name="height"
                    value={boardProperties.height}
                    onChange={handleChange}
                />
                <label htmlFor="width">Width</label>
                <input 
                    type="number"
                    id="width"
                    name="width"
                    value={boardProperties.width}
                    onChange={handleChange}
                />
                <label htmlFor="mines">Mines</label>
                <input 
                    type="number"
                    id="mines"
                    name="mines"
                    value={boardProperties.mines}
                    onChange={handleChange}
                />
                <br />
                <button>Confirm</button>
            </form>}
            {itemOpen === "settings" && 
            <form>
                <input 
                    type="checkbox"
                />
                <label>Sound</label>
            </form>}
        </nav>
    )
}