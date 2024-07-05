import { useState, FormEvent, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/auth-context";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [token, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const {auth, setAuthData} = useContext(AuthContext);
    const navigate = useNavigate();

    async function loginUser(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, token })
            });
            const data = await response.json();
            console.log(`Données de login : ${data}`);
            if (response.ok) {
                setAuthData(data);
                setMessage(`Connecté en tant que : ${email}`);
            } else {
                setMessage("Echec de la connexion");
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage("Echec de la connexion");
        }
    }

    useEffect(() => {
        if (auth?.data?.email) {
            navigate("/meteo");
        }
    }, [auth, navigate]);

    return (
        <div>
            <pre>{JSON.stringify(auth)}</pre>
            <h3>{message}</h3>
            <h3>Connexion</h3>
            <form onSubmit={loginUser}>
                <div>
                    <label htmlFor="email">E-mail : </label>
                    <input onChange={e => setEmail(e.target.value)} type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe : </label>
                    <input onChange={e => setPassword(e.target.value)} type="password" id="password" name="password" required />
                </div>
                <div>
                    <button type="submit">Connexion</button>
                </div>
            </form>
        </div>
    );
}
