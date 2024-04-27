import EmailSignIn from "@/components/authentication/email";
import GoogleSignIn from "@/components/authentication/googlesignin";

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <EmailSignIn/>
            <GoogleSignIn/>
        </div>
    );
}
