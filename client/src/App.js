import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import EventView from "./components/EventView/EventView";
import EventPanel from "./components/EventPanel/EventPanel";
import NotFound from "./components/NotFound";
import EventCreate from "./components/Create/EventCreate";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./helpers/RequireAuth";
import {useEffect, useReducer, useState} from "react";
import {ContextApp, initialState, testReducer} from "./utils/reducer";
import {Profile} from "./components/Profile/Profile";
import MainPage from "./components/MainPage/MainPage";
import Header from "./components/Header/Header";
import CreateOrg from "./components/Create/CreateOrg";
import MyOrganizations from "./components/MyOrganizations/MyOrganizations";
import OrganizationPanel from "./components/OrganizationPanel/OrganizationPanel";
import ItemCreate from "./components/Create/ItemCreate";
import Shop from "./components/Shop/Shop";
import ProductView from "./components/Shop/ProductView/ProductView";
import Server from "./helpers/Server";

function App() {
    const [state, dispatch] = useReducer(testReducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        Server.get("user/check").then(res => {
            dispatch({
                type: 'test_update',
                payload: {
                    user: res.data.user
                }
            })
            localStorage.setItem("isAuth", 'true')
            setIsSuccess(true)
            setIsLoading(true)
        }).catch((e) => {
            localStorage.removeItem("isAuth")
            setIsSuccess(false)
            setIsLoading(true)
        })
    }, [])

    return (
        <div className="App">
            <ContextApp.Provider value={{dispatch, state}}>
                <Header/>
                <Routes>
                    {localStorage.getItem('auth')===null &&
                        <>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="register" element={<Registration/>}/>
                            <Route path="event/:id" element={<EventView/>}/>
                            <Route path="organization/:id" element={<OrganizationPanel/>}/>
                        </>
                    }

                    <Route element={<RequireAuth isLoading={isLoading} isSuccess={isSuccess}/>}>
                        <Route path="shop" element={<Shop/>}/>
                        <Route path="product/:id" element={<ProductView/>}/>
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="create_event/:id" element={<EventCreate/>}/>
                        <Route path="create_item/:id" element={<ItemCreate/>}/>
                        <Route path="createOrg" element={<CreateOrg/>}/>
                        <Route path="forbidden" element={<Unauthorized/>}/>
                        <Route path="manage_event/:id" element={<EventPanel/>}/>
                        <Route path="organizations" element={<MyOrganizations/>}/>
                    </Route>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </ContextApp.Provider>
        </div>
    )
}

export default App