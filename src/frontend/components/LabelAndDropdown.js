import React from "react"
import { nanoid } from "nanoid"

export default function LabelAndDropdown(props) {
    function generateDropdownElements(name, values, state, setStateFunction) {
        return values.map(value =>
            <div key={nanoid()}
            onClick={() => props.dropdownEvent(name, value, setStateFunction)}
            style={{backgroundColor: value === state ? "lightblue" : "none"}}
            className="dropdown-item">{value}</div>)
    }
    return (
        <div style={{marginBottom: "5px"}}>
            <div className="label-and-dropdown">
                <span>{props.labelName}: {props.state}</span>
                <div>
                    <button onClick={() => props.toggleDropdown(props.dropdownName)}>Select</button>
                    {props.showDropdown === props.dropdownName && <div className="dropdown-container">
                        {generateDropdownElements(props.dropdownName, props.items,
                            props.state, props.setStateFunction)}
                    </div>}
                </div>
            </div>
        </div>
    )
}