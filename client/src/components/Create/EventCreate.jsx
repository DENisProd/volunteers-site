import './create.css'
import TextField from "../TextField/TextField";
import {Link, useNavigate, useParams} from "react-router-dom";
import useInput from "../TextField/UseInput";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {ContextApp} from "../../utils/reducer";
import React from "react";
import Server from "../../helpers/Server";

const stages = [
    {
        level: 1,
        name: 'Основные данные мероприятия'
    },
    {
        level: 2,
        name: 'Дополнительные данные мероприятия'
    },
    {
        level: 3,
        name: 'Контактные данные'
    },
    {
        level: 4,
        name: 'Выберите местоположение'
    }
]


export default function EventCreate() {
    const navigate = useNavigate()
    const {id} = useParams()
    const today = new Date()

    let data = {
        title: useInput('', {isEmpty: true}),
        description: useInput('', {isEmpty: true}),
        location: useInput(''),
        startDate: useInput(today.toISOString().substring(0,16)),
        email: useInput('', {isEmpty: true, isEmail: true}),
        telegram: useInput(''),
        phone: useInput(''),
        age: useInput(0),
        salary: useInput(0),
        audience: useInput(''),
        awards: useInput(''),
        services: useInput(''),
        vacancySphere: useInput(''),
        deadlines: useInput(''),
        endDate: useInput(null)
    }
    const [eventData, setEventData] = useState({
        difficult: null,
        participateWays: null,
        typeOfEvent: null,
        requirements: null,
        tasks: null,
    })
    const imageRef = useRef();
    const [file, setFile] = useState();
    const [stage, setStage] = useState(stages[0])
    const [image, setImage] = useState(null)

    const changeInputEvent = (event) => setEventData({...eventData, [event.target.name]: event.target.value})

    const handleFileChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileObject = event.target.files[0];
        if (!fileObject) return;
        setFile(fileObject)

        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            reader.onload = (e) => {
                setImage(e.target.result)
            }
        }
    }

    const create = () => {
        let fd = new FormData()
        for (let el in eventData) {
            fd.append(el, eventData[el])
        }
        for (let el in data) {
            fd.append(el, data[el].value)
        }
        fd.append('file', file)
        fd.append('type', 'event_preview')

        Server.post("event/" + id, fd).then(res => {
            if(res.status===201) navigate('/organization/' + id)
        })
    }

    const move = (to) => {
        if (to===1) {
            if (stage.level<stages.length) setStage(stages[stage.level])
        }
        if (to===-1) {
            if (stage.level>1) setStage(stages[stage.level-2])
        }
    }

    const getCard = () => {

    }

    return (
        <div className="create_container" id="event">
            <div className="create_block_container">
                <h4>Создайте мероприятие, на которое требуются волонтеры</h4>
                <button onClick={getCard}>карта</button>
                <h3>{stage.level} / {stages.length}</h3>
                <div className="create_block">
                    <div>
                        <h2>{stage.name}</h2>
                        {(stage.level!==1 && stage.level!==stages.length) && <button onClick={() => move(-1)}>Назад</button>
                        }
                        {stage.level === 1 ?
                            <>
                                <div className={"file_choose " + (!image && 'empty')}>
                                    <img src={image}/>
                                    <input name="file" onChange={handleFileChange} ref={imageRef} accept="image/*"
                                           type="file"
                                           className={'form_input'} placeholder="Выберите аватар"/>
                                </div>

                                <TextField useInput={data.title} placeholder="Название мероприятия"/>
                                <TextField useInput={data.description}
                                           placeholder="Описание деятельности"/>
                                <TextField useInput={data.location} placeholder="Расположение"/>
                                <TextField useInput={data.startDate} placeholder="Дата и время начала"
                                           type="datetime-local"/>
                                <div className="field_container">
                                    <select name="typeOfEvent" onChange={changeInputEvent} value={eventData.typeOfEvent}
                                            placeholder="Тип мероприятия" className='form_input'>
                                        <option value="work">Работа</option>
                                        <option value="event">Мероприятие</option>
                                    </select>
                                </div>
                            </>
                            :
                            stage.level === 2 ?
                                <>
                                    <div className="field_container">
                                        <select name="difficulty" onChange={changeInputEvent}
                                                value={eventData.difficult} placeholder="Сложность *"
                                                className="form_input">
                                            <option value="easy">Легкий</option>
                                            <option value="medium">Средний</option>
                                            <option value="hard">Сложный</option>
                                            <option value="other">Особые навыки</option>
                                        </select>
                                    </div>
                                    <div className="field_container">
                                        <select name="participateWays" onChange={changeInputEvent}
                                                value={eventData.participateWays} placeholder="Способ участия *"
                                                className='form_input'>
                                            <option value="online">Онлайн</option>
                                            <option value="offline">Оффлайн</option>
                                            <option value="mixed">Смешанный</option>
                                        </select>
                                    </div>
                                    <TextField useInput={data.endDate} placeholder="Дата и время конца"
                                               type="datetime-local"/>
                                    <TextField useInput={data.age} placeholder="Ограничения на возраст"
                                               type="number" min={0} max={100}/>
                                    <div className="field_container">
                                        <textarea name="requirements" onChange={changeInputEvent}
                                                  value={eventData.requirements} placeholder="Требования к кандидату"
                                                  className='form_input'/>
                                    </div>
                                    <div className="field_container">
                                        <textarea name="tasks" onChange={changeInputEvent} value={eventData.tasks}
                                                  placeholder="Задачи" className='form_input'/>
                                    </div>
                                    <TextField useInput={data.deadlines} placeholder="Сроки"/>
                                    {eventData.typeOfEvent==="work" &&
                                        <>
                                            <TextField useInput={data.salary} value={data.salary} placeholder="Заработная плата"
                                                       type="number" min={0} max={1000000}/>
                                            <TextField useInput={data.audience} placeholder="Целевая аудитория"/>
                                        </>
                                    }

                                    {eventData.typeOfEvent==="event" &&
                                        <>
                                            <TextField useInput={data.awards} placeholder="Награды для волонтеров"/>
                                            <TextField useInput={data.services} placeholder="Доступный сервис для волонтеров"/>
                                        </>
                                    }

                                    <TextField useInput={data.vacancySphere} placeholder="Сфера вакансии"/>
                                </>
                                :
                                stage.level === 3 ?
                                <>
                                    <TextField useInput={data.telegram} placeholder="Telegram"/>
                                    <TextField useInput={data.email} type="email" placeholder="Email"/>
                                    <TextField useInput={data.phone} placeholder="Номер телефона"/>
                                    <button className="form_btn" onClick={create}>Создать</button>
                                    <h5>Нажимая кнопку “Создать” вы соглашаетесь с <Link to="/rules">правилами нашего
                                        сервиса.</Link></h5>
                                </>
                                    :
                                    stage.level === 4 ?
                                        <div/>
                                        :
                                    <>
                                        <h3>Мероприятие создано</h3>
                                    </>
                        }
                        {stage.level<stages.length-1 && <button className="form_btn" onClick={() => move(1)}>Далее</button>}
                    </div>

                </div>
            </div>
        </div>
    )
}