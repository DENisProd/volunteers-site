import React from 'react';
import {useNavigate} from "react-router-dom";
import URL from "../../utils/Config";

const ProductCard = (props) => {
    const navigate = useNavigate()

    return (
        <div className="event_card_container" onClick={() => navigate('/product/'+props.prod._id)}>
            <img src={URL + props.prod.img} alt="product image"/>
            <div className="content">
                <h3>{props.prod.name}</h3>
                <h4>Цена: {props.prod.price} $</h4>
                <h4>Описание: {props.prod.description}</h4>
                <h4>Организация: {props.prod.contactOrganization.name}</h4>
            </div>
        </div>
    )
};

export default ProductCard;