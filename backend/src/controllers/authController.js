import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../services/db.js";

export const register = async (req, res) => {

  const { name, email, password } =
    req.body;

  const hashedPassword =
    await bcrypt.hash(password, 10);

  db.run(
    `
    INSERT INTO users
    (name,email,password,role)
    VALUES(?,?,?,?)
    `,
    [
      name,
      email,
      hashedPassword,
      "admin"
    ],
    function (err) {

      if (err) {
        return res.status(400).json({
          error: err.message
        });
      }

      res.json({
        message: "User Registered",
        id: this.lastID
      });

    }
  );
};