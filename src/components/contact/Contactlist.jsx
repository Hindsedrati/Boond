import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { cleanContactData } from "../../utils/cleanContacts"; // Nettoyage des contacts

const Contactlist = ({ contacts, companies, states }) => {
  console.log("🔍 Contacts reçus AVANT nettoyage :", contacts);

  if (!Array.isArray(contacts)) {
    return <p>Pas de contacts disponibles</p>;
  }

  // Appliquer le nettoyage AVANT affichage
  const cleanedContacts = cleanContactData(contacts);
  console.log("✅ Contacts APRES nettoyage :", cleanedContacts);

  return (
    <>
      <h2>Liste des contacts avec emails valides</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>État</th>
            <th>Société</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cleanedContacts.length > 0 ? (
            cleanedContacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.attributes.lastName}</td>
                <td>{contact.attributes.email1}</td>
                <td>{contact.attributes.function || "N/A"}</td>
                <td>{states[contact.attributes.state] || "Inconnu"}</td>
                <td>
                  {companies.find(company => company.id === contact.relationships?.company?.data?.id)?.attributes?.name || "Non attribué"}
                </td>
                <td>
                  <button onClick={() => sendEmail(contact)}>📧 Envoyer Email</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucun contact avec email valide</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

// Fonction pour envoyer un email via le serveur Node.js
const sendEmail = async (contact) => {
  console.log(`📤 Tentative d'envoi d'email à ${contact.attributes.email1}...`);

  // Récupération des informations du contact
  const { lastName, function: jobTitle, state } = contact.attributes;
  const companyName = contact.relationships?.company?.data?.attributes?.name || "Non attribué";

  // Construction du message personnalisé
  const emailMessage = `
      Bonjour ${lastName},

      Nous vous contactons concernant votre rôle en tant que ${jobTitle || "professionnel"} 
      chez ${companyName}. 

      Votre statut actuel est : ${state || "Non précisé"}.

      Nous aimerions échanger avec vous à ce sujet. Merci de nous contacter à votre convenance.

      Cordialement,
      [Ton Nom / Ton Entreprise]
  `;

  try {
      const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              email: contact.attributes.email1, 
              name: lastName,
              message: emailMessage // On envoie le message personnalisé
          }),
      });

      const result = await response.json();
      console.log("✅ Réponse complète du serveur :", result);

      if (result.message) {
          alert(result.message);
      } else {
          alert("❌ Erreur : " + JSON.stringify(result));
      }
  } catch (error) {
      console.error('❌ Erreur lors de l’envoi de l’email :', error);
      alert("Échec de l’envoi de l’email. Voir console.");
  }
};


Contactlist.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        lastName: PropTypes.string.isRequired,
        email1: PropTypes.string.isRequired,
        function: PropTypes.string.isRequired,
        state: PropTypes.number.isRequired,
      }).isRequired,
      relationships: PropTypes.shape({
        company: PropTypes.shape({
          data: PropTypes.shape({
            id: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      }).isRequired
    })
  ).isRequired,
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  states: PropTypes.object.isRequired
};

export default Contactlist;
