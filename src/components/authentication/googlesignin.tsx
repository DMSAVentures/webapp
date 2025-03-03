import Linkbutton from "@/components/simpleui/linkbutton/linkbutton";
import {Button, SignInButton} from "@/components/simpleui/Button/button";

export default function GoogleSignIn() {
    //TODO: This is process env vars are undefined on client side.
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL}&scope=openid%20profile%20email`;


    return (
        <SignInButton variant={'primary'} leftIcon={"google-fill"} href={googleAuthUrl}>
        Sign in with Google
        </SignInButton>
    );
}
