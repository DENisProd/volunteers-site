import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Server from "../../../helpers/Server";
import './product-view.css'
import URL from "../../../utils/Config";
import ProductPhotoCard from "./ProductPhotoCard";
import Modal from "./Modal";

const ProductView = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCreator, setCreator] = useState(false)
    const [currentImg, setCurrentImg] = useState()
    const [isMod, setIsMod] = useState(false)
    const [data, setData] = useState({})


    useEffect(() => {
        update()

    }, [])

    useEffect(() => {
        setCurrentImg(URL + data.img)
    }, [isLoaded])

    const update = () => {
        Server.get("shop/" + id).then(res => {
            setData(res.data.prod)
            setCreator(res.data.isCreator)
            setIsLoaded(true)
        })
    }

    const deleteProduct = () => {
        Server.delete("shop/" + id).then(res => {
            navigate('/shop/')
        })
    }

    const buyProduct = () => {
        Server.get("shop/buy/" + id).then(res => {
            navigate('/shop/')
        })
    }

    return (
        <>
            {isMod && <Modal update={update} id={id} type='shop' setIsModalOpen={setIsMod}/>}

            <div className="prod-container">
                {isLoaded ?
                    <div className="prod-block">
                        <div className="prod-img-block">
                            <img className="current" src={(currentImg) || ''} alt="product image"/>
                            <div className="prod-img-container">
                                <ProductPhotoCard photo={URL + data.img} setCurrentImage={setCurrentImg}/>
                                {data.images.map((photo,index) =><ProductPhotoCard key={index} photo={URL + photo} setCurrentImage={setCurrentImg}/>)}
                                {isCreator && <ProductPhotoCard photo={"none"} setIsModalOpen={setIsMod}/>}
                            </div>
                        </div>

                        <div>
                            <h1>{data.name} {isCreator && <button className="product-remove" onClick={deleteProduct}>Удалить</button>}</h1>
                            <h1>{data.price} $</h1>
                            <h3>Описание: {data.description}</h3>
                            <h3>Способ доставки: {data.delivery}</h3>
                            <h3>Продавец: {data.contactOrganization.name}</h3>
                            <h4>По всем вопросам в telegram: @{data.contactOrganization.telegram}</h4>
                            <button className="prod-buy" onClick={buyProduct}>Купить</button>
                        </div>
                    </div>
                    :
                    <h2>Загрузка...</h2>
                }
            </div>
        </>
    )
};

export default ProductView;