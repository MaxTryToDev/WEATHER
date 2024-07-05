//Import des dépendances
import { useEffect, useState, useContext } from "react";

//Déclaration des types
type AwekasData = {
	current: {
		datatimestamp: number;
		temperature: number;
		dewpoint: number;
		humidity: number;
		airpress_rel: number;
		uv: number;
		indoortemperature: number;
		indoorhumidity: number;
	};
};

//Déclaration des fonctions
function formatTemp(temp: number): string {
	if (!temp) {
		return "-";
	}
	return temp.toString().concat(" °C");
}
function formatHumidity(humidity: number): string {
	if (!humidity) {
		return "-";
	}
	return humidity.toString().concat(" %");
}
function formatPressure(pressure: number): string {
	if (!pressure) {
		return "-";
	}
	return pressure.toString().concat(" hPa");
}
function formatUv(uv: number): string {
	if (!uv) {
		return "-";
	}
	return uv.toString().concat(" idx");
}
function formatDate(timeStamp: number): String{
    const date = new Date((timeStamp) * 1000).toLocaleDateString('fr-FR');
    const time = new Date((timeStamp) * 1000).toLocaleTimeString('fr-FR');
    return date + ' ' + time;
}

export default function WeatherForm() {
    const [weather, setWeather] = useState<AwekasData>();
	
	useEffect(() => {
		async function loadWeather() {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/weather`)
            const data: AwekasData = await response.json();
            setWeather(data);
		}
        loadWeather();
	}, []);

    if(!weather?.current) return <div>Chargement des données ...</div>;
	return (
        <div>
            <h1>Météo SOULLANS : </h1>

            <div>Horodatage : {formatDate(weather.current.datatimestamp)}</div>
            <div>Temperature : {formatTemp(weather.current.temperature)}</div>
            <div>Point de rosée : {formatTemp(weather.current.dewpoint)}</div>
            <div>Humidité : {formatHumidity(weather.current.humidity)}</div>
            <div>Pression atmosphérique : {formatPressure(weather.current.airpress_rel)}</div>
            <div>Index UV : {formatUv(weather.current.uv)}</div>
            <div>Température intérieure : {formatTemp(weather.current.indoortemperature)}</div>
            <div>Humidité intérieure : {formatHumidity(weather.current.indoorhumidity)}</div>

            <div>Variable d'environnement : {process.env.REACT_APP_API_URL}</div>
        </div>
    );
}
