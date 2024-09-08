import EmailSignIn from "@/components/authentication/email";
import GoogleSignIn from "@/components/authentication/googlesignin";
import ContentDivider from "@/components/baseui/contentdivider/contentdivider";
import './login.scss'

export default function Login() {
    return (
        <div className={'login'}>
            <EmailSignIn/>
            <ContentDivider size={'thin'} styleType={'grey'} text={'OR'}/>
            <GoogleSignIn/>
        </div>
    );
}
