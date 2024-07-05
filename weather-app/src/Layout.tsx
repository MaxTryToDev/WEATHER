import { AuthContext } from "./contexts/auth-context";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children?: React.ReactNode }) {
	const { auth, setAuthData } = useContext(AuthContext);

	return (
		<div>
			<Link to="/">Accueil</Link>
			{auth?.data?.email ? (
				<div>
					<nav>
						<Link to="/meteo">Météo</Link>
					</nav>
					Utilisateur : {auth.data.email}{" "}
					<button onClick={() => setAuthData(null)}>Se déconnecter</button>
				</div>
			) : (
				<nav>
					<Link to="/inscription">S'inscrire</Link>
					<br></br>
					<Link to="/connexion">Se connecter</Link>
				</nav>
			)}
			<div>{children}</div>
		</div>
	);
}
