import React, {useContext} from "react";
import {AuthContext} from "@/contexts/auth";
import Login from "@/components/authentication/login";

export default function WebApp (): React.JSX.Element {
    const authContext = useContext(AuthContext);
    if (!authContext.isLoggedIn) {
        return (
            <Login/>
        );
    }
    return (
        <div>
            <h1>Webapp</h1>
        </div>
    );
}
