import EmailSignIn from "@/components/authentication/email";
import GoogleSignIn from "@/components/authentication/googlesignin";

export default function Login() {
    return (
        <div>
            <EmailSignIn/>
            <hr/>
            <GoogleSignIn/>
        </div>
    );
}
