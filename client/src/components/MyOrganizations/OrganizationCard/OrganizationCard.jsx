import './organization-card.css'
import URL from "../../../utils/Config";
import {useNavigate} from "react-router-dom";

export default function OrganizationCard(props) {
    const navigate = useNavigate()

    return (
        <div className="org_card_container" onClick={() => navigate('../organization/'+ props.org._id)}>
            <img src={URL + props.org.img}/>
            <div className="org_card_text">
                <h3>{props.org.name}</h3>
                <h4>{props.org.description}</h4>
                <h4>{props.org.location}</h4>
                <h4>Telegram: @{props.org.telegram}</h4>
                <h4>Email: {props.org.email}</h4>
            </div>
        </div>
    )
}