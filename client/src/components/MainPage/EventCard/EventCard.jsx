import './event-card.css'
import URL from "../../../utils/Config";
import {useNavigate} from "react-router-dom";

export default function EventCard(props) {
    const navigate = useNavigate()
    const formatDate = (date) => {
        return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
    }
    return (
        <div className="event_card_container" onClick={() => navigate('/event/'+props?.event?._id)}>
            <img src={URL + props?.event?.img}/>
            <div className="content">
                <h3>{props?.event?.title}</h3>
                <h4>{props?.event?.location}</h4>
                <h4>{formatDate(new Date(props?.event?.startDate))}</h4>
                <h4>{props?.event?.company}</h4>
                <h4>{props?.event?.description}</h4>
            </div>
        </div>
    )
}