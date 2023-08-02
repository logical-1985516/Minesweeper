import React from "react"

export default function ChangeBoard(props) {
    const [currentBoard, setCurrentBoard] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")) || {
        difficulty: "Beginner",
        height: 8,
        width: 8,
        initialMines: 10
    })
    console.log(JSON.parse(localStorage.getItem("currentBoard")))
    /**
     * The properties that we are going to change to
     */
    const [boardProperties, setBoardProperties] = React.useState({
        difficulty: "",
        height: "",
        width: "",
        initialMines: ""
    })

    function handleChange(event) {
        const {name, value} = event.target
        setBoardProperties(oldBoardProperties => {
            return {...oldBoardProperties, [name]: value}
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (boardProperties.difficulty === "Beginner") {
            boardProperties.height = 8
            boardProperties.width = 8
            boardProperties.initialMines = 10
        } else if (boardProperties.difficulty === "Intermediate") {
            boardProperties.height = 16
            boardProperties.width = 16
            boardProperties.initialMines = 40
        } else if (boardProperties.difficulty === "Expert") {
            boardProperties.height = 16
            boardProperties.width = 30
            boardProperties.initialMines = 99
        } else if (boardProperties.difficulty === "Custom") {
            boardProperties.height = Number(boardProperties.height)
            boardProperties.width = Number(boardProperties.width)
            boardProperties.initialMines = Number(boardProperties.initialMines)
        } else {
            console.log("please select valid size")
            return
        }
        props.changeBoardProperties(boardProperties)
        setCurrentBoard({
            difficulty: boardProperties.difficulty,
            height: boardProperties.height,
            width: boardProperties.width,
            initialMines: boardProperties.initialMines
        })
        setBoardProperties({
            difficulty: "",
            height: "",
            width: "",
            initialMines: ""
        })
    }

    React.useEffect(() => {
        localStorage.setItem("currentBoard", JSON.stringify(currentBoard))
    }, [currentBoard])

    return (
        <div className="changeBoard--container">
            <div className="changeBoard--current">
                <div className="changeBoard--current-title">Currently selected:</div>
                <div>Difficulty: {currentBoard.difficulty}</div>
                <div>Height: {currentBoard.height}</div>
                <div>Width: {currentBoard.width}</div>
                <div>Mines: {currentBoard.initialMines}</div>
            </div>
            <form onSubmit={handleSubmit} className="changeBoard--form">
                <input
                    type="radio"
                    id="Beginner"
                    name="difficulty"
                    value="Beginner"
                    checked={boardProperties.difficulty === "Beginner"}
                    onChange={handleChange}
                />
                <label htmlFor="Beginner" className="changeBoard--beginner">Beginner</label>
                <br />
                <input
                    type="radio"
                    id="Intermediate"
                    name="difficulty"
                    value="Intermediate"
                    checked={boardProperties.difficulty === "Intermediate"}
                    onChange={handleChange}
                />
                <label htmlFor="Intermediate" className="changeBoard--intermediate">Intermediate</label>
                <br />
                <input
                    type="radio"
                    id="Expert"
                    name="difficulty"
                    value="Expert"
                    checked={boardProperties.difficulty === "Expert"}
                    onChange={handleChange}
                />
                <label htmlFor="Expert" className="changeBoard--expert">Expert</label>
                <br />
                <input
                    type="radio"
                    id="Custom"
                    name="difficulty"
                    value="Custom"
                    checked={boardProperties.difficulty === "Custom"}
                    onChange={handleChange}
                />
                <label htmlFor="Custom" className="changeBoard--custom">Custom</label>
                <label htmlFor="height">Height</label>
                <input 
                    type="number"
                    id="height"
                    name="height"
                    value={boardProperties.height}
                    onChange={handleChange}
                    min={1}
                    max={30}
                    step={1}
                    className="changeBoard--input"
                />
                <label htmlFor="width">Width</label>
                <input
                    type="number"
                    id="width"
                    name="width"
                    value={boardProperties.width}
                    onChange={handleChange}
                    min={1}
                    max={30}
                    step={1}
                    className="changeBoard--input"
                />
                <label htmlFor="initialMines">Mines</label>
                <input 
                    type="number"
                    id="initialMines"
                    name="initialMines"
                    value={boardProperties.initialMines}
                    onChange={handleChange}
                    min={0}
                    max={boardProperties.height * boardProperties.width - 1}
                    step={1}
                    className="changeBoard--input"
                />
                <br />
                <button className="changeBoard--button">Confirm</button>
            </form>
        </div>
    )
}