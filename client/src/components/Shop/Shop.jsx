import React, {useEffect, useState} from 'react';
import Server from "../../helpers/Server";
import ProductCard from "./ProductCard";

const Shop = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState()

    useEffect(() => {
        Server.get("shop").then(res => {
            setData(res.data.prods)
            setIsLoaded(true)
        })
    },[])

    return (
        <div className="main_container">
            <h1>Магазин</h1>

            <div id="list-block">
                {isLoaded ?
                    <>
                        {data.map(prod =>
                            <ProductCard prod={prod} key={prod._id}/>
                        )}
                    </>
                    :
                    <h4>Загрузка...</h4>
                }
            </div>
        </div>
    );
};

export default Shop;