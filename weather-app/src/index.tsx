import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import WeatherForm from "./pages/WeatherForm";
import AuthProvider from "./contexts/auth-context";
import Layout from "./Layout";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Layout>
				<h1> Accueil</h1>
				<img src="./pictures/meteo.png"></img>
				<img src="pictures/bresser.jpg"></img>
			</Layout>
		),
	},
	{
		path: "/inscription",
		element: (
			<Layout>
				<RegisterForm />
			</Layout>
		),
	},
	{
		path: "/connexion",
		element: (
			<Layout>
				<LoginForm />
			</Layout>
		),
	},
	{
		path: "/meteo",
		element: (
			<Layout>
				<WeatherForm />
			</Layout>
		),
	},
]);

root.render(
	<AuthProvider>
		<RouterProvider router={router} />
	</AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
