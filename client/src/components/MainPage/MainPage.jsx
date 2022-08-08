import './main_page.css'
import UserCard from "./UserCard/UserCard";
import EventCard from "./EventCard/EventCard";
import {useEffect, useState} from "react";
import Server from "../../helpers/Server";

const tagsColors = [
    'blue',
    'blue1',
    'green',
    'pink',
    'yellow',
    'cyan',
    'red',
    'purple'
]

export default function MainPage() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState()
    const [fromBd, setFromBd] = useState()
    const [top, setTop] = useState()

    useEffect(() => {
        Server.get("event").then(res => {
            let temp =  res.data
            setFromBd(temp)
            setData(temp) // null

            Server.get('user/top').then(res => {
                setTop(res.data.users)
                setIsLoaded(true)

            })

        })
    },[])

    // const sortByPopular = () => {
    //     setIsLoaded(false)
    //     setData([{name: "aboba"}])
    //     let temp = fromBd
    //     let events = temp.sort((a,b) => b.views - a.views) // все есть
    //     setData(events)
    //     //console.log(fromBd.sort((a,b) => b.views - a.views))
    //     console.log(events)
    //     //console.log(data.sort((a,b) => (a.views > b.views) ? 1 : ((b.views > a.views) ? -1 : 0)))
    //     setIsLoaded(true)
    // }

    return (
        <div className="main_container">
            <h1>Доска почета</h1>
            <div className="main_block">
                {isLoaded ?
                    <>
                        {top.map((user,index) => <UserCard user={user} index={index}/>)}
                    </>
                :
                    <h4>Загрузка...</h4>
                }
            </div>

            <h1>Мероприятия</h1>
            <div className="main_block">
                <input placeholder="Поиск добрых дел"/>
                <div className="tags">
                    <button className={tagsColors[Math.floor(Math.random() * tagsColors.length)]}>Стажировка</button>
                    <button className={tagsColors[Math.floor(Math.random() * tagsColors.length)]}>Акция</button>
                    <button className={tagsColors[Math.floor(Math.random() * tagsColors.length)]}>Помощь</button>
                    <button className={tagsColors[Math.floor(Math.random() * tagsColors.length)]}>Пожертвования</button>
                </div>
            </div>

            <div className="main_block">
                <div className="sorting">
                    <button>По популярности</button>
                    <button>По названию</button>
                    <button className="active">По новизне</button>
                </div>
            </div>

            <div id="list-block">
                {isLoaded ?
                    <>
                        {data.map(event =>
                            <EventCard event={event}/>
                        )}
                    </>
                    :
                    <h4>Загрузка...</h4>
                }
            </div>
        </div>
    )
}