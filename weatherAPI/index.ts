//Import des dépendances
import express, { Request, Response } from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import validationMiddleware from "./middleware/validation_middleware";
import { registerSchema } from "./schemas/user_schemas";
import { db } from './lib/db';

//Déclaration des constantes
const app = express();
app.use(express.json());
const port = process.env.PORT;

//Déclaration des types
type AwekasData = {
  current: {
    datatimestamp: number;
    timeoffset: number;
    temperature: number;
    dewpoint: number;
    humidity: number;
    airpress_rel: number;
    uv: number;
    indoortemperature: number;
    indoorhumidity: number
  };
};

// ############################################################################ Méthodes GET ############################################################################ //

//Route de connexion
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

//Route d'accès à la station météo
app.get("/weather", async (req: Request, res: Response) => {
  const response = await fetch(`https://api.awekas.at/current.php?key=${process.env.KEY}`);
  const data: AwekasData = await response.json() as AwekasData;
  res.json({ 
    datatimestamp: data.current.datatimestamp,
    timeoffset: data.current.timeoffset,
    temperature: data.current.temperature,
    dewpoint: data.current.dewpoint,
    humidity: data.current.humidity,
    airpress_rel: data.current.airpress_rel,
    uv: data.current.uv,
    indoortemperature: data.current.indoortemperature,
    indoorhumidity: data.current.indoorhumidity,
  });
});

// ############################################################################ Méthodes POST ############################################################################ //

//Route de création de compte
app.post("/register", validationMiddleware(registerSchema), async function (req, res) {
  const { email, password } = req.body;
  // Vérifier qu'un utilisateur avec un email n'existe pas
  const [results] = await db.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM awekasUsers WHERE email = ?",
    [email]
  );

  // S'il existe déjà, renvoyer une erreur
  if (results[0].count > 0) {
    res.status(400).send("User already exists with this email");
    return;
  }

  // Hasher le mot de passe avant de le stocker
  const hashedPassword = await bcrypt.hash(password, 10);

  // Sinon, créer l'utilisateur et renvoyer OK
  const [inserted] = await db.query<ResultSetHeader>(
    "INSERT INTO awekasUsers (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  res.json({ id: inserted.insertId });
}
);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});