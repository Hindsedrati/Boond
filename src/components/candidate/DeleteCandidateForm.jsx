import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtEncode } from "../../utils/utils";

const DeleteCandidateForm = ({ onCandidateDeleted }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { value } = event.target;
    setCandidateId(value);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!candidateId) {
      setErrorMessage("Veuillez entrer un ID de candidat valide.");
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
        `https://ui.boondmanager.com/api/candidates/${candidateId}`,
        {
          method: "DELETE",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        onCandidateDeleted();
        setErrorMessage("");
        toast.success("Candidat supprimé avec succès !");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la suppression du candidat !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la suppression du candidat !");
    }
  };

  return (
    <Box component="form" onSubmit={handleDelete} sx={{ mt: 3 }}>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <FormControl fullWidth margin="normal">
        <FormLabel>ID du candidat</FormLabel>
        <Input
          type="text"
          value={candidateId}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Supprimer
      </Button>
    </Box>
  );
};

DeleteCandidateForm.propTypes = {
  onCandidateDeleted: PropTypes.func.isRequired,
};

export default DeleteCandidateForm;
