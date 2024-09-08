export default function GoogleSignIn() {
    //TODO: This is process env vars are undefined on client side.
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email`;


    return (
        <div className={"button-container"}>
        <a className={"sign-in-button"} href={googleAuthUrl}>
            Sign In with Google
        </a>
        </div>
    );
}
