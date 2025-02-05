export const cleanContactData = (contacts) => {
    if (!Array.isArray(contacts)) return [];

    console.log("🔍 Nombre de contacts AVANT nettoyage :", contacts.length);

    const cleaned = contacts
        .map(contact => {
            let email = contact.attributes?.email1 || "";
            let lastName = contact.attributes?.lastName || "Inconnu";

            // Vérification email logique
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                email = "Email non valide";
            }

            return {
                ...contact,
                attributes: {
                    ...contact.attributes,
                    lastName,
                    email1: email,
                }
            };
        })
        .filter(contact => contact.attributes.email1 !== "Email non valide"); // 🔹 On ne garde que les bons emails

    console.log("✅ Nombre de contacts APRÈS nettoyage :", cleaned.length);
    return cleaned;
};
