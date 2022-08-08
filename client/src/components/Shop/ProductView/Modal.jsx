import React, {useRef, useState} from 'react';
import axios from "axios";
import URL from "../../../utils/Config";

const Modal = (props) => {

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
        fd.append(props.type==="shop" ? 'shop-preview' : props.type==="avatar" ? 'avatar' : 'image', file)

        let url_text = props.type==='shop' ? "shop/image/"+ props.id : props.type==="avatar" && "user/avatar"

        axios.post(URL + url_text,
            fd,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                props.update()
                props.setIsModalOpen(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
                <div className="window">
                    <div>
                        <button onClick={() => props.setIsModalOpen(false)}>Закрыть</button>
                        <h1>Добавление нового фото</h1>
                        <img src={image} alt="product image"/>
                        <input name="file" onChange={handleFileChange} ref={imageRef} accept="image/*" type="file"
                               className="form_input" placeholder="Выберите изображение товара"/>
                        <button onClick={create}>Добавить</button>
                    </div>
                </div>
        </>

    );
};

export default Modal;