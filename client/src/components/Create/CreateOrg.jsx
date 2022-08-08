import './create.css'
import TextField from "../TextField/TextField";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useInput from "../TextField/UseInput";
import React, {useContext, useRef, useState} from "react";
import {ContextApp} from "../../utils/reducer";
import axios from "axios";
import URL from "../../utils/Config"

export default function CreateOrg() {
    const navigate = useNavigate()

    let data = {
        name: useInput('', {isEmpty: true}),
        description: useInput('', {isEmpty: true}),
        location: useInput(''),
        email: useInput('', {isEmpty: true, isEmail: true}),
        telegram: useInput(''),
        phone: useInput('')
    }
    const imageRef = useRef();
    const [file, setFile] = useState();
    const [image, setImage] = useState(null)

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
        for (let el in data) {
            fd.append(el, data[el].value)
        }
        fd.append('file', file)

        axios.post(URL + "organization",
            fd,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                navigate('/organizations')
            })
            .catch(err => console.log(err))

        console.log(fd)
    }

    return (
        <div className="create_container">
            <div className="create_block_container">
                <h4>Имея организацию вы сможете создавать мероприятия, на которые требуются волонтеры! Также вы сможете
                    добавлять товары в нашем мини-магазине.</h4>
                <div className="create_block">
                    <div>
                        <h2>Основные данные</h2>
                        <div className="file_choose">
                            <img src={image}/>
                            <input name="file" onChange={handleFileChange} ref={imageRef} accept="image/*" type="file"
                                   className="form_input" placeholder="Выберите аватар"/>
                        </div>

                        <TextField useInput={data.name} placeholder="Название организации"/>
                        <TextField useInput={data.description} placeholder="Описание деятельности"/>
                        <TextField useInput={data.location} placeholder="Расположение"/>
                    </div>

                    <div>
                        <h2>Контактны организации</h2>
                        <TextField useInput={data.telegram} placeholder="Telegram"/>
                        <TextField useInput={data.email} type="email" placeholder="Email"/>
                        <TextField useInput={data.phone} placeholder="Номер телефона"/>
                        <button className="form_btn" onClick={create}>Создать</button>
                        <h5>Нажимая кнопку “Создать” вы соглашаетесь с <Link to="/rules">правилами нашего
                            сервиса.</Link></h5>
                    </div>

                </div>
            </div>
        </div>
    )
}