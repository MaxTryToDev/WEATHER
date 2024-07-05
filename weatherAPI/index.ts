//Import des dépendances
import express, { Request, Response } from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { registerSchema, loginSchema,  } from "./schemas/user_schemas";
import { db } from './lib/db';
import cors from "cors";
import jwt from "jsonwebtoken";
import validationMiddleware from "./middleware/validation_middleware";
import authMiddleware from "./middleware/auth_middleware";

//Déclaration des constantes
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

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
    indoorhumidity: number
  };
};

type User = {
  id: number;
  email: string;
  password: string;
}

// ############################################################################ Méthodes GET ############################################################################ //

//Route home
app.get("/", (req: Request, res: Response) => {
  res.send("Météo SOULLANS");
});

//Route d'accès à la station météo
app.get("/weather", async (req: Request, res: Response) => {
  const response = await fetch(`https://api.awekas.at/current.php?key=${process.env.KEY}`);
  const data= await response.json();
  res.json(data);


//Données de test en dur lorsque l'API est HS
  // const data: AwekasData = {
  //   "current": {
  //   "datatimestamp": 1720099543,
  //   "temperature": 19.8,
  //   "dewpoint": 12,
  //   "humidity": 60,
  //   "airpress_rel": 1016.9,
  //   "uv": 8.8,
  //   "indoortemperature": 22.7,
  //   "indoorhumidity": 60,
  //   }
  // }; 
  // res.json(data);

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

//Login
app.post("/login",  validationMiddleware(loginSchema), async function (req: Request, res: Response) {
    const { email, password } = req.body;
    console.log("TEST");
    // Récupérer l'utilisateur qui a cette adresse e-mail dans la base de données
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT id, email, password FROM awekasUsers WHERE email = ?`,
      [email]
    );

    const user = result as User[];

    // Si l'utilisateur n'existe pas
    if (user.length === 0) {
      res.status(400).send("Invalid email");
      return;
    }
    console.log("Utilisateur OK");

    // Si l'utilisateur existe, vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      // Si le mot de passe est incorrect
      res.status(400).send("Invalid password");
      return;
    }
    console.log("Mot de passe OK");

    // Si le mot de passe est correct
    const tokenPayload = { id: user[0].id };
    const token = jwt.sign(tokenPayload, process.env.SECRET as string, {
      expiresIn: "1h",
    });

    res.json({
      email: user[0].email,
      token,
    });
  }
);

//Démarrage du server web
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});