export default function EmailSignIn() {
    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Prevent the default form submission

        // Create a FormData object to extract form data
        const formData = new FormData(event.currentTarget);

        // Retrieve the form data by field name
        const email = formData.get("email");
        const password = formData.get("password");

        console.log("Email:", email);
        console.log("Password:", password);

        // Add your form submission logic here, like sending the data to a server
    }

    return (
        <div>
            <h1>Sign in with Email</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email" // Link to label
                        name="email"
                        type="email"
                        required // Make it a required field
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password" // Link to label
                        name="password"
                        type="password"
                        required // Make it a required field
                    />
                </div>
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
}
