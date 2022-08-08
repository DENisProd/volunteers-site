import React, { useRef, useState} from 'react';
import TextField from "../TextField/TextField";
import {Link, useNavigate, useParams} from "react-router-dom";
import useInput from "../TextField/UseInput";
import axios from "axios";
import URL from "../../utils/Config";

const ItemCreate = () => {

    const navigate = useNavigate()
    const {id} = useParams()
    let data = {
        name: useInput('', {isEmpty: true}),
        description: useInput('', {isEmpty: true}),
        delivery: useInput(''),
        price: useInput(''),
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
        fd.append('shop-preview', file)

        axios.post(URL + "shop/"+id,
            fd,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                navigate('/organization/' + id)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="create_container">
            <div className="create_block_container">
                <h4>Создавайте товары в нашем мини-магазине для превлечения большего количества волонтеров для вашего мероприятия</h4>
                <div className="create_block">


                    <div>
                        <h2>Основные данные</h2>
                        <div className="file_choose">
                            <img src={image} alt="product image"/>
                            <input name="file" onChange={handleFileChange} ref={imageRef} accept="image/*" type="file"
                                   className="form_input" placeholder="Выберите изображение товара"/>
                        </div>

                        <TextField useInput={data.name} placeholder="Название товара"/>
                        <TextField useInput={data.description} placeholder="Описание товара"/>
                        <TextField useInput={data.delivery} placeholder="Способ доставки"/>
                        <TextField type={"number"} useInput={data.price} placeholder="Стоимость"/>

                        <button className="form_btn" onClick={create}>Создать</button>
                        <h5>Нажимая кнопку “Создать” вы соглашаетесь с <Link to="/rules">правилами нашего
                            сервиса.</Link></h5>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ItemCreate;