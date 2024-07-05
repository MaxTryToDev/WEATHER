//Import des dépendances
import { Request, Response } from "express";
import "dotenv/config";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from '../lib/db';
import { RowDataPacket } from "mysql2/promise";
import { User } from "../types/user";

type DecodedToken = {
  id: number
}
export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  //Récupération du token depuis les headers de la requête
  const token = req.headers.authorization;
  //Si le token n'est pas renseigné renvoyer une erreur 401
  if (!token) {
    return res.status(401).send("auth-token missing");
  }
  //Vérification du token
  try {
    //Décodage du token
    const decoded = jwt.verify(token, process.env.SECRET ?? '') as DecodedToken;
    //Une fois le token décodé, il faut récupérer l'utilisateurs associé depuis la BDD
    const [result] = await db.query<RowDataPacket[]>(
      "SELECT id, email FROM users WHERE id = ?",
      [decoded.id]
    );

    const user = result as User[];
    
    //Si l'utilisateur n'existe pas
    if (user.length === 0) {
      res.status(401).send("unauthorized");
      return;
    }
    //Si l'utilisateur existe, on peut ajouter l'utilisateur à la requête
    //req.user = user[0];
    next();
    //Catch de l'erreur
  } catch (err) {
    console.error(err);
    res.status(401).send("unauthorized");
    return;
  }
}