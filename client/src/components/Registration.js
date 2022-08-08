import {Link, useNavigate} from "react-router-dom";
import '../styles/auth.css'
import TextField from "./TextField/TextField";
import useInput from "./TextField/UseInput";
import {useEffect, useState} from "react";
import Server from "../helpers/Server";

export default function Registration() {
    const email = useInput('', {isEmpty: true, minLength: 3, isEmail: true})
    const firstName = useInput('', {isEmpty: true, minLength: 1})
    const lastName = useInput('', {isEmpty: true, minLength: 1})
    const password = useInput('',{isEmpty: true, minLength: 3, maxLength: 12})
    const password1 = useInput('',{isEmpty: true, minLength: 3, maxLength: 12, isEquals: password.value})
    const birthday = useInput(null)

    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth')
        if(isAuth) navigate('/profile')
    }, [])

    const register = () => {
        const user = {
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            password: password.value,
            password1: password1.value,
            birthday: birthday.value
        }

        Server.post("auth/registration", user)
            .then(res => {
                setMessage(res.data.message)
                navigate('/login')
            })
            .catch(res => {
                setMessage(res.response.data.message)
            })
    }

    return (
        <div className="form__container">
            <div className="form">
                <h1>Регистрация</h1>
                <TextField useInput={email} name="email" type="email" placeholder="Email"/>
                <TextField useInput={firstName} name="name" placeholder="Имя"/>
                <TextField useInput={lastName} name="surname" placeholder="Фамилия"/>
                <TextField useInput={birthday} name="birthday" type="date" placeholder="Дата рождения"/>
                <TextField useInput={password} name="password" type="password" placeholder="Пароль"/>
                <TextField useInput={password1} name="password1" type="password" placeholder="Повтор пароля"/>

                <button onClick={register}>Создать аккаунт</button>
                <h4>Уже есть аккаунт? <Link to="/login">Войдите</Link></h4>
                <h5>{message}</h5>
            </div>

        </div>
    )
}
