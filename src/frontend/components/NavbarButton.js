export default function NavbarButton(props) {
    const styles = {
        "backgroundColor": props.isActive ? "lightblue" : "beige",
        "border": "none",
        "color": "black",
        "fontSize": "16px",
        "padding": "0 16px"
    };
    return (
        <button style={styles} onClick={props.onClick}>
            {props.label}
        </button>
    );
}
