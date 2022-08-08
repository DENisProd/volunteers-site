import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import URL from "../../utils/Config";
import Server from "../../helpers/Server";
import './event-panel.css'
import {compare_field, compare_string} from "../../helpers/Sort";

export default function EventPanel() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [information, setInformation] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const [sorted, setSorted] = useState([])
    const [sortState, setSortState] = useState({
        first_name: false,
        last_name: false,
    })
    const [anytimeSorted, setAnytimeSorted] = useState(false)

    useEffect(() => {
        update()
    }, []);

    const update = () => {
        setIsLoaded(false)
        Server.get("event/panel/" + id).then(res => {
            setInformation(res.data.event)
            if (anytimeSorted) sort(sortState.first_name ? 'first_name' : 'last_name')
            setIsLoaded(true)
        })
    }

    const formatDate = (date) => {
        return date.getDate() + '.' + date.getMonth() + 1 + '.' + date.getFullYear()
    }

    const deleteEvent = () => {
        if (window.confirm('Вы уверены?')) {
            Server.delete("event/" + id).then(res => {
                navigate('/organization/' + information.author)
            })
        }
    }

    const sort = (name) => {
        setIsLoaded(false)
        let massive = []

        if (name === 'first_name') {
            const compare_user = compare_field('firstName', compare_string)
            massive = information.subscribers.sort(compare_user)
            if (sortState.first_name) setSorted(massive)
            else setSorted(massive.reverse())

            setSortState({
                first_name: !sortState.first_name,
                last_name: sortState.last_name
            })

        } else if (name === 'last_name') {
            const compare_user = compare_field('lastName', compare_string)
            massive = information.subscribers.sort(compare_user)
            if (sortState.last_name) setSorted(massive)
            else setSorted(massive.reverse())

            setSortState({
                first_name: sortState.first_name,
                last_name: !sortState.last_name
            })
        }

        setAnytimeSorted(true)
        setIsLoaded(true)
    }

    return (
        <div className="event_panel_container">
            {isLoaded ?
                <>
                    <div className="event_panel_content">
                        <h1>Панель управления мероприятием " {information.title} "</h1>
                        <div className="event_panel_block">

                            <button className='blue' name="first_name" onClick={(e) => sort(e.target.name)}>По
                                имени {sortState.first_name ? '+' : '-'}</button>
                            <button className='blue' name="last_name" onClick={(e) => sort(e.target.name)}>По
                                фамилии {sortState.last_name ? '+' : '-'}</button>
                            {anytimeSorted &&
                                <button onClick={() => {
                                    setAnytimeSorted(false)
                                    setSorted([])
                                }}>Убрать сортировку</button>}
                            <input placeholder="Поиск пользователя"/>
                            <button onClick={update}>Обновить</button>
                        </div>
                        <table>
                            <tbody>
                            {sorted.length > 0 ?
                                sorted.map(sub =>
                                    <LineCard sub={sub} id={id} link={information.presenseLink} key={sub._id}/>
                                )
                                :
                                information.subscribers.map(sub =>
                                    <LineCard sub={sub} id={id} link={information.presenseLink} key={sub._id}/>
                                )}
                            </tbody>
                        </table>

                    </div>
                    <div className="event_panel_sidebar">
                        <img alt="event_img" src={URL + information?.img}/>
                        <h3>{information.title}</h3>
                        <h4>{information.description}</h4>
                        <h4>Организатор: <Link
                            to={'/organization/' + information.author}>{information.fullInfo.company}</Link></h4>
                        <h4>Местоположение: {information.location}</h4>
                        <h4>Telegram: @{information.telegram}</h4>
                        <h4>Email: {information.fullInfo.contactEmail}</h4>
                        <h4>Ограничение на возраст: {information.fullInfo.age}+</h4>
                        <h4>Начало {information.startDate.substring(0, 10).replace('-', '.')}</h4>
                        <button onClick={deleteEvent} className='red'>Удалить</button>
                        <div>
                            QR-код для отметки посещения
                            <img id='event_panel_qr' alt='qr code' src={'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://hack.mysecrets.site/persense/'+information.presenseLink}/>
                        </div>
                    </div>
                </>
                :
                <h3>Загрузка...</h3>
            }
        </div>
    )
}

function LineCard({sub, id, link}) {

    const [hours, setHours] = useState(sub.hours || 1)

    const setHoursApi = () => {

        Server.post("event/panel/hours/" + id, {
            id: sub.user._id,
            hours
        }).then(res => console.log(res.data))
    }

    const setPersense = () => {
        Server.post('event/panel/persense/' + link, {user: sub.user._id}).then(res => {
            console.log(res.data)
        })
    }

    return (
        <tr key={sub.user._id}>
            <td>
                <img src={sub.user.avatar ? URL + sub.user.avatar : 'https://pixelbox.ru/wp-content/uploads/2021/09/avatar-boys-vk-68.jpg'}/>
            </td>
            <td>
                <h3>{sub.user.lastName}</h3>
            </td>
            <td>
                <h3>{sub.user.firstName}</h3>
            </td>
            <td>
                <h3>{sub.user.email}</h3>
            </td>
            <td>
                <a>Оставить отзыв</a>
            </td>
            <td>
                <div>Отработано часов:
                    <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min={1} max={20}
                           step={1}/>
                    <button onClick={setHoursApi} className='blue'>OK</button>
                </div>
            </td>
            <td>
                <button onClick={setPersense} className={!sub.presense && 'red'}>{sub.presense ? "Присутствовал" : "Отсутствовал"}</button>
            </td>
        </tr>
    )
}