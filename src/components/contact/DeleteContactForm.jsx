// src/components/contact/DeleteContactForm.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, FormLabel, Input } from '@mui/material';
import { toast } from 'react-toastify';
import { jwtEncode } from "../../utils/utils";

const DeleteContactForm = ({ onContactDeleted }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [contactId, setContactId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { value } = event.target;
    setContactId(value);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!contactId) {
      setErrorMessage("Veuillez entrer un ID de contact valide.");
      return;
    }

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: "normal",
      };

      const jwtToken = jwtEncode(payload, ClientKey);
      const response = await fetch(
        `https://ui.boondmanager.com/api/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        onContactDeleted();
        setErrorMessage("");
        toast.success("Contact supprimé avec succès !");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la suppression du contact !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la suppression du contact !");
    }
  };

  return (
    <Box component="form" onSubmit={handleDelete} sx={{ mt: 3 }}>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <FormControl fullWidth margin="normal">
        <FormLabel>ID du contact</FormLabel>
        <Input
          type="text"
          value={contactId}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Supprimer
      </Button>
    </Box>
  );
};

DeleteContactForm.propTypes = {
  onContactDeleted: PropTypes.func.isRequired,
};

export default DeleteContactForm;
