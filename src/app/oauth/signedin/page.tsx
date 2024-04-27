'use client'
export default function OAuthSignedIn() {
    // Get token from URL
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
        // Save token to local storage
        localStorage.setItem("token", token);
        // Redirect to home page using nextjs router
        window.location.href = "/";
    }
    return (
        <div>
            <h1>Sign in successful</h1>
        </div>
    );
}
