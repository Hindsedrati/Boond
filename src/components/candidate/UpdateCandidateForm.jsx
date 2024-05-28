// src/components/candidate/UpdateCandidateForm.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtEncode } from "../../utils/utils";

const UpdateCandidateForm = ({ onCandidateUpdated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [candidateId, setCandidateId] = useState("");
  const [candidateData, setCandidateData] = useState({
    firstName: "",
    lastName: "",
    email1: "",
    phone1: "",
    title: "", // Ajout du champ "fonction"
    state: 0
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
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
        `https://ui.boondmanager.com/api/candidates/${candidateId}/information`,
        {
          method: "GET",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const candidate = result.data.attributes;
        setCandidateData({
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email1: candidate.email1 || "",
          phone1: candidate.phone1 || "",
          title: candidate.title || "",
          state: candidate.state || 0
        });
        setErrorMessage("");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la récupération du candidat !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la récupération du candidat !");
    }
  };

  const handleSubmit = async (event) => {
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
        `https://ui.boondmanager.com/api/candidates/${candidateId}/information`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({
            data: {
              type: "candidate",
              id: candidateId,
              attributes: {
                firstName: candidateData.firstName,
                lastName: candidateData.lastName,
                email1: candidateData.email1,
                phone1: candidateData.phone1,
                title: candidateData.title,
                state: candidateData.state,
              },
            },
          }),
        }
      );

      if (response.ok) {
        onCandidateUpdated();
        setErrorMessage("");
        toast.success("Candidat mis à jour avec succès !");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la mise à jour du candidat !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la mise à jour du candidat !");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <FormControl fullWidth margin="normal">
        <FormLabel>ID du candidat</FormLabel>
        <Input
          type="text"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
        />
        <Button type="button" variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 3 }}>
          Rechercher
        </Button>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Prénom</FormLabel>
        <Input
          type="text"
          name="firstName"
          value={candidateData.firstName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Nom</FormLabel>
        <Input
          type="text"
          name="lastName"
          value={candidateData.lastName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Fonction</FormLabel>
        <Input
          type="text"
          name="title"
          value={candidateData.title}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Mettre à jour
      </Button>
    </Box>
  );
};

UpdateCandidateForm.propTypes = {
  onCandidateUpdated: PropTypes.func.isRequired,
};

export default UpdateCandidateForm;
