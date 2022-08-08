import React, {useEffect, useState} from 'react';
import EventCard from "../MainPage/EventCard/EventCard";

import "./org-panel.css"
import URL, {CLIENT_URL} from "../../utils/Config";
import {useNavigate, useParams} from "react-router-dom";
import Server from "../../helpers/Server";

const OrganizationPanel = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [data, setData] = useState({})
    const [unactiveEvents, setUnactiveEvents] = useState([])
    const [activeEvents, setActiveEvents] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCreator, setIsCreator] = useState(false)

    useEffect(() => {
        Server.get('organization/' + id).then(res =>{
            setData(res.data.orgs)
            setIsCreator(res.data.isOwner|false)
            groupEvents(res.data.orgs.createdEvents)
        })
    }, [])

    // const checkIsCreator = () => {
    //     if (data.contactUser===)
    // }

    const groupEvents = (events) => {
        let unactiveEvents = []
        let activeEvents = []
        if (events) {
            events.map(event => {
                const today = new Date()
                if (event.endDate) {
                    const endDate = new Date(event.endDate)
                    if (endDate >= today) {
                        activeEvents.push(event)
                    } else {
                        unactiveEvents.push(event)
                    }
                } else {
                    const startDate = new Date(event.startDate)
                    if (startDate >= today) {
                        activeEvents.push(event)
                    } else {
                        unactiveEvents.push(event)
                    }
                }
            })
        }
        setUnactiveEvents(unactiveEvents)
        setActiveEvents(activeEvents)
        setIsLoaded(true)
    }

    return (
        <div className="org_panel_container">
            <div className="org_main_block">
                <h2>Активные мероприятия организации ({activeEvents.length})</h2>
                {isLoaded ?
                    <div className="events_list">
                        {activeEvents.map(event =>
                            <EventCard event={event} key={event._id}/>
                        )}
                    </div>
                    :
                    <h3>Загрузка...</h3>
                }


                <h2>Завершенные мероприятия организации ({unactiveEvents.length})</h2>
                {isLoaded ?
                    <div className="events_list">
                        {unactiveEvents.map(event =>
                            <EventCard event={event} key={event._id}/>
                        )}
                    </div>
                    :
                    <h3>Загрузка...</h3>
                }
            </div>

            <div className="org_sidebar">
                {isLoaded ?
                    <>
                        <img className='head' src={(URL + data.img) || ''} alt="event image"/>
                        <h3>{data.name}</h3>
                        <h4>{data.description}</h4>
                        <h4>Местоположение: {data.location}</h4>
                        <h4>Telegram: @{data.telegram}</h4>
                        <h4>Email: {data.email}</h4>
                        <h4>Помогает людям с {data.registeredDate.substring(0, 10).replace('-', '.')}</h4>
                        {isCreator &&
                            <>
                                <button className="form_btn">Настройки</button>
                                <button className="form_btn" onClick={() => navigate('/create_event/' + id)}>Создать
                                    мероприятие
                                </button>
                                <button className="form_btn" onClick={() => navigate('/create_item/' + id)}>Создать товар в магазине</button>
                            </>
                        }


                        <img className='qr' alt="event qr code"
                             src={'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + CLIENT_URL + 'organization/' + data._id}/>
                    </>
                    :
                    <h3>Загрузка...</h3>
                }
            </div>
        </div>
    );
};

export default OrganizationPanel;