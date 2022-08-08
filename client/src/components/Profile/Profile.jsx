import React, {useContext, useEffect, useState} from "react";
import {ContextApp} from "../../utils/reducer";
import URL from "../../utils/Config";
import './profile.css'
import avatar from '../../img/avatar.png'
import {Link, useNavigate} from "react-router-dom";
import Server from "../../helpers/Server";
import EventCard from "../MainPage/EventCard/EventCard";
import Modal from "../Shop/ProductView/Modal";

function getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function Profile() {
    const {state, dispatch} = useContext(ContextApp);
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isMod, setIsMod] = useState(false)

    useEffect(() => {
        update()
    }, [])

    const update = () => {
        Server.get("user/").then(res => {
            dispatch({
                type: 'test_update',
                payload: {
                    user: res.data
                }
            })

            dispatch({
                type: 'test_update',
                payload: {
                    userDetail: res.data
                }
            })

            setIsLoaded(true)
        })
    }

    return (
        <>
            {isMod && <Modal update={update} id={state._id} type='avatar' setIsModalOpen={setIsMod}/>}

            <div className="profile_main">
                <div className="profile_container">
                    {isLoaded ?
                        <>
                            <div className="profile_block header">
                                <div>
                                    <img src={(state.user.avatar ? URL+state.user.avatar : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png")}
                                         alt={"user avatar"} onClick={() => setIsMod(true)}/>
                                    <div className="info">
                                        <h2>{state.user.firstName} {state.user.lastName}</h2>
                                        <h4>Добрых дел: <span>{state.user.takePart}</span></h4>
                                        <h4>Создано добрых дел: <span>{state.user.createdEventsN}</span></h4>
                                        <h4>Отработано часов: <span>{state.user.hours}</span></h4>
                                        <h4>г. Ростов-на-Дону</h4>
                                        <h4>Возраст: {getAge(state.user.birthday)}</h4>
                                        <h4>Рейтинг: {state.user.reputation}</h4>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="info">
                                        <h3>Предпочитает</h3>
                                        <h4>Добрых дел: <span>57</span></h4>
                                        <h4>Создано добрых дел: <span>{state.user.createdEventsN}</span></h4>
                                        <h3>Контакты</h3>
                                        <h4>{state.user.email}</h4>
                                        <h4>{state.user.phoneNumber}</h4>
                                        <h4>{state.user.telegram}</h4>
                                    </div>

                                    <img src={avatar}/>
                                </div>


                            </div>
                            <div className="profile_block_list">
                                {state.user.events.map(event =>
                                    <EventCard event={event} key={event._id}/>
                                )}
                            </div>
                            <div className="profile_block">

                            </div>
                            <div className="profile_block">

                            </div>
                            <div className="profile_block">

                            </div>
                        </>
                        :
                        <h1>Загрузка...</h1>}
                </div>
                <div className="profile_sidebar">
                    <button className="form_btn" onClick={() => navigate('/createOrg')}>Создать организацию</button>
                    <button className="form_btn" onClick={() => {
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                    }}>Выйти
                    </button>
                </div>
            </div>
        </>
    )
}