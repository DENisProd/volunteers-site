import {useContext, useEffect, useState} from "react";
import {ContextApp} from "../../utils/reducer";
import OrganizationCard from "./OrganizationCard/OrganizationCard";
import './my-org.css'
import Server from "../../helpers/Server";

export default function MyOrganizations() {
    const {state, dispatch} = useContext(ContextApp)

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        Server.get("organization").then(res => {
            dispatch({
                type: 'test_update',
                payload: {
                    orgs: res.data.orgs
                }
            })
            setIsLoaded(true)
        })
    }, [])

    return (
        <div className="my_org_container">
            <h2>Мои организации</h2>
            {isLoaded ?
                <div className="my_org_cards">
                    {
                        state.orgs.map(org => (
                            <OrganizationCard key={org._id} org={org}/>
                        ))
                    }
                </div>
            :
                <h1>Загрузка...</h1>
            }
        </div>
    )

}