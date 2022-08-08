import './header.css'
import {Link, useLocation} from "react-router-dom";
import URL from "../../utils/Config";
import logo from '../../img/logo.svg'
import avatar from '../../img/avatar.png'
import {useContext, useEffect, useState} from "react";
import {ContextApp} from "../../utils/reducer";

export default function Header() {
    const [currentLocation, setCurrentLocation] = useState('/')
    const {state, dispatch} = useContext(ContextApp)

    let location = useLocation()

    useEffect(() => {
        console.log("смена локации")
        setCurrentLocation(location.pathname || "/")
        console.log(currentLocation)
    }, [location])

    return(
        <header>
            <div className="logo">
                <img alt="logo" src={logo}/>
                <span>Помогай</span>
            </div>

            <div className="navigation">
                <Link className={currentLocation==="/" ? "active" : ''} to="/">Главная</Link>
                {state?.user ?
                    <>
                        <Link className={currentLocation==="/shop" ? "active": ''} to="/shop">Магазин</Link>
                        <Link className={currentLocation==="/organizations" ? "active" : ''} to="/organizations">Мои организации</Link>
                    </>
                    :
                    <Link className={currentLocation==="/login" ? "active" : ''} to="/login">Вход</Link>
                }

            </div>

            {state?.user?.firstName &&
                <Link to="/profile" className={currentLocation==="/profile" ? "profile active" : 'profile'}>
                    <div>
                        <div className="name">{state?.user?.firstName}</div>
                        <div className="balance">{state?.user?.coins} $</div>
                    </div>
                    <img src={(state.user.avatar ? URL+state.user.avatar : "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png")}
                         alt="user avatar"/>
                </Link>
            }
        </header>
    )
}