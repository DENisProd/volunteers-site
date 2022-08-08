import './user_card.css'
import URL from "../../../utils/Config";

export default function UserCard(props) {
    return (

        <div className="user_card_container">
            <div><img src={(props.user.avatar ? URL+props.user.avatar : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png")} alt={"user picture"}/></div>
            <h3>{props.user.firstName} {props.user.lastName}</h3>
            <h4>Посещено мероприятий: <span>{props.user.takePart}</span></h4>
            <h4>Часов волонтерства: <span>{props.user.hours}</span></h4>
            <h2>{props.index + 1} место</h2>
        </div>
    )
}