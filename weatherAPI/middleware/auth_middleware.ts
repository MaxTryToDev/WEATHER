// import { NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import mysql from "mysql2/promise";
// const db = await mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
// });

// export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
//   //Récupération du token depuis les headers de la requête
//   const token = req.headers.authorization;
//   //Si le token n'est pas renseigné renvoyer une erreur 401
//   if (!token) {
//     res.status(401).send("unauthorized");
//     return;
//   }
//   //Vérification du token
//   try {
//     //Décodage du token
//     const decoded = jwt.verify(token, process.env.SECRET);
//     //Une fois le token décodé, il faut récupérer l'utilisateurs associé depuis la BDD
//     const [user] = await db.query(
//       "SELECT id, email, last_login_at FROM users WHERE id = ?",
//       [decoded.id]
//     );
//     //Si l'utilisateur n'existe pas
//     if (user.length === 0) {
//       res.status(401).send("unauthorized");
//       return;
//     }
//     //Si l'utilisateur existe, on peut ajouter l'utilisateur à la requête
//     req.user = user[0];
//     next();
//     //Catch de l'erreur
//   } catch (err) {
//     console.error(err);
//     res.status(401).send("unauthorized");
//     return;
//   }
// }