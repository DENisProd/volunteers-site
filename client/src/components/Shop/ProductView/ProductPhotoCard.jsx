import React from 'react';

const ProductPhotoCard = (props) => {
    return (
        <div className="prod-photo-card">
            {props.photo==="none" ?
                <button onClick={() => props.setIsModalOpen(true)}>+</button>
                :
                <img src={props.photo} alt="product photo" onClick={() => props.setCurrentImage(props.photo)}/>
            }
        </div>
    );
};

export default ProductPhotoCard;