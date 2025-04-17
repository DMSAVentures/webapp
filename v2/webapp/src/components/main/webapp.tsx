'use client'
import "./webapp.scss"
import React from "react";
import {Button, SignInButton} from "@/components/simpleui/Button/button";

export default function WebApp (): React.JSX.Element {
    return (

            <div>
                <h1>Webapp - WEBAPP GIG</h1>
                <p>This is a message</p>
                <Button variant={'primary'} leftIcon={"google-fill"}>
                    Sign in with Google
                </Button>
            </div>
    );
}
