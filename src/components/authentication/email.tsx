export default function EmailSignIn() {
    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(event)
    }
    return (
        <div>
            <h1>Sign in with Email</h1>
            <form onSubmit={handleLogin}>
                <input type={"email"}/>
                <input type={"password"}/>
            </form>
        </div>
    );
}
