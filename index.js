import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurer Nodemailer pour l'envoi d'email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// API pour envoyer un email avec un message personnalisé
app.post('/send-email', async (req, res) => {
    const { email, name, message } = req.body;

    console.log(`📩 Envoi d'email à : ${email}, Nom : ${name}`);

    if (!email || !name || !message) {
        console.error("❌ Erreur : Email, nom ou message manquant");
        return res.status(400).json({ error: 'Email, nom ou message manquant' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Un message pour vous, ${name}`,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé :", info.response);
        res.status(200).json({ message: `Email envoyé à ${email}` });
    } catch (error) {
        console.error("❌ Erreur envoi email :", error);
        res.status(500).json({ error: "Erreur lors de l'envoi de l'email", details: error.message });
    }
});

// Lancer le serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));
