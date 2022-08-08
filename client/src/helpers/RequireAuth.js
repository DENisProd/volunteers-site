import {useLocation, Navigate, Outlet} from "react-router-dom";

export default function RequireAuth(props) {
    const location = useLocation();

    return (
        <>
            {
                props.isLoading ?
                    <>
                        {props.isSuccess ?
                            <Outlet/>
                            :
                            <Navigate to="/login" state={({from: location})}/>
                        }
                    </>
                    :
                    <h1>Загрузка...</h1>
            }
        </>
    )
}