export default function GoogleSignIn() {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email`;


    return (
        <a href={googleAuthUrl}>
            Sign in with Google
        </a>
    );
}
