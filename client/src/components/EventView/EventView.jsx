import {Link, useNavigate, useParams} from "react-router-dom";
import URL, {CLIENT_URL} from "../../utils/Config";
import React, {useContext, useEffect, useState} from "react";
import "./event-view.css"
import {ContextApp} from "../../utils/reducer";
import Server from "../../helpers/Server";

export default function EventView() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isSubscribed, setSubscribed] = useState(false)
    const [isCreator, setCreator] = useState(false)
    const [data, setData] = useState({})
    const {state} = useContext(ContextApp);

    useEffect(() => {
        Server.get('event/'+id).then(res => {
            setData(res.data.event)
            setCreator(res.data.isCreator||false)
            setIsLoaded(true)
        })
    },[])

    useEffect(() => {
        checkIsSubscribed(data)
    },[state.user && isLoaded])


    const checkIsSubscribed = (dat) => {
        if (dat.subscribers) {
            let subs = dat.subscribers
            for (let i = 0; i < subs.length; i++)
                if (subs[i].user===state.user.id)
                    setSubscribed(true)
        }
    }

    const subscribe = () => {
        Server.get("event/subs/"+data._id).then(res => {
            setIsLoaded(false)
            console.log(res.data.event);
            setData(res.data.event)

            checkIsSubscribed(res.data.event)
            setIsLoaded(true)
        })
    }

    return (
        <div className="org_panel_container">
            <div className="view_main_block">

                {isLoaded ?
                    <>
                        <div className="view_img_container">
                            <img src={(URL + data?.img) || ''} alt="event image"/>
                        </div>

                        <h2>{data?.title}</h2>
                        <p>{data?.fullInfo?.fullDescription || data.description}</p>
                        <div className="view_double_block">
                            <img src={"https://dekorimage.ru/upload/iblock/fd4/fd430f23e43bc82b41816472b45d6f86.jpg"} alt="event map"/>
                            <div>
                                <h4>Местоположение: {data?.location}</h4>
                                <h4>Начало  {data?.startDate.substring(0,10).replace('-','.')}</h4>
                            </div>
                        </div>

                        <h2>О мероприятии</h2>
                        <p>Способ участия: <span>{data.participateWays||'-'}</span></p>
                        <p>Сложность: <span>{data.difficulty||'-'}</span></p>
                        <p>Тип работы: <span>{data.fullInfo.workType||'-'}</span></p>
                        <p>Требования к кандидатам: <span>{data.fullInfo.requirements||'-'}</span></p>
                        <p>Задачи: <span>{data.fullInfo.tasks||'-'}</span></p>
                        <p>Количество подписчиков: <span>{data.subscribers.length}</span></p>
                        <p>Количество просмотров: <span>{data.views}</span></p>
                        <p>Срочность: <span>{data.fullInfo.deadlines||'-'}</span></p>
                        <p>Сфера вакансии: <span>{data.fullInfo.vacancySphere||'-'}</span></p>
                        <p>Наименование вакансии: <span>{data.fullInfo.vacancyName||'-'}</span></p>
                        <p>Тэги: <span>{data.tags||'-'}</span></p>
                        <p>Условия вакансии <span>{data.workInfo.conditions||'-'}</span></p>
                        <p>Зарплата: <span>{data.workInfo.salary||'-'}</span></p>
                        <p>Целевая аудитория: <span>{data.workInfo.audience||'-'}</span></p>
                        <p>Награды для волонтеров: <span>{data.helperInfo.awards||'-'}</span></p>
                        <p>Сервис для волонтеров: <span>{data.helperInfo.services||'-'}</span></p>
                    </>

                    :
                    <h3>Загрузка...</h3>
                }

            </div>

            <div className="view-sidebar">
                {isLoaded ?
                    <>
                        <img className='head' src={(URL + data?.img) || ''} alt="event image"/>
                        <h3>{data.title}</h3>
                        <h4>{data.description}</h4>
                        <h4>Организатор: <Link to={'/organization/'+ data.author}>{data.fullInfo.company}</Link></h4>
                        <h4>Местоположение: {data.location}</h4>
                        <h4>Telegram: @{data.telegram}</h4>
                        <h4>Email: {data.fullInfo.contactEmail}</h4>
                        <h4>Ограничение на возраст: {data.fullInfo.age}+</h4>
                        <h4>Начало  {data.startDate.substring(0,10).replace('-','.')}</h4>
                        {isCreator && <button className="form_btn" onClick={() => navigate('/manage_event/'+id)}>Настройки</button>}
                        {(!isSubscribed && state.user) && <button className="form_btn" onClick={subscribe}>Подписаться</button>}
                        {!state.user && <Link to={'/login'}>Чтобы подписаться необходимо авторизоваться</Link>}
                        <img className='qr' alt="event qr code"
                             src={'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+CLIENT_URL+'event/'+id}/>
                    </>
                    :
                    <h3>Загрузка...</h3>
                }
            </div>
        </div>
    )
}