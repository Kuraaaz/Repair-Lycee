CREATE DATABASE IF NOT EXISTS profile;
USE profile;

CREATE TABLE profile_users (
    id SERIAL PRIMARY KEY,      -- Identifiant unique auto-incrémenté
    email VARCHAR(255) UNIQUE NOT NULL,  -- Adresse e-mail unique et obligatoire
    nom VARCHAR(100),           -- Nom de l'utilisateur (optionnel au début)
    prenom VARCHAR(100),        -- Prénom de l'utilisateur (optionnel au début)
    classe VARCHAR(50),         -- Classe de l'utilisateur (optionnelle au début)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Date de création du compte
);