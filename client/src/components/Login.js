import {useContext, useEffect, useState} from "react";
import '../styles/auth.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from "./TextField/UseInput";
import TextField from "./TextField/TextField";
import URL from "../utils/Config"
import axios from "axios";
import {ContextApp} from "../utils/reducer";
import Server from "../helpers/Server";

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const email = useInput('', {isEmpty: true, isEmail: true})
    const password = useInput('',{isEmpty: true})

    const [message, setMessage] = useState('')

    const {state, dispatch} = useContext(ContextApp)

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth')
        // if(isAuth) {
        //     if (from === '/' || from === '/register')
        //         navigate('/profile')
        //     else
        //         navigate(from)
        // }
    }, [])

    const logIn = () => {
        const user = {
            email: email.value,
            password: password.value
        }

        Server.post('auth/login', user).then(res => {
            localStorage.setItem("token", res.data.token)
            //localStorage.setItem("isAuth", 'true')

            dispatch({
                type: 'test_update',
                payload: {
                    user: res.data.user
                }
            })

            // if(from==='/'||from==='/register')
            //     navigate('/profile')
            // else
            //     navigate(from)
            window.location.href=from
        }).catch(res => {
            setMessage(res.response.data.message)
        })
    }

    return (
        <div className="form__container">
            <div className="form">
                <h1>Авторизация</h1>
                <TextField useInput={email} name="email" type="email" placeholder="Email"/>
                <TextField useInput={password} name="password" type="password" placeholder="Пароль"/>

                <button className="form_btn" onClick={logIn}>Войти</button>
                <h4>Нет аккаунта? <Link to="/register">Создайте</Link></h4>
                <h5>{message||from}</h5>
            </div>

        </div>
    )
}