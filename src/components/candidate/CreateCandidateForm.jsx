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

const CreateCandidateForm = ({ onCandidateCreated }) => {
  
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [candidateData, setCandidateData] = useState({
    type: "candidate",
    attributes: {
      firstName: "",
      lastName: "",
      civility: 0,
      state: 0,
      typeOf: -1,
      title: "",
      email1: "",
      email2: "",
      email3: "",
      phone1: "",
      phone2: "",
      phone3: "",
      fax: "",
      address: "",
      postcode: "",
      town: "",
      country: "",
      source: {
        typeOf: -1,
        detail: "",
      },
      dateOfBirth: "",
      mobilityAreas: [],
      globalEvaluation: "",
      evaluations: [],
      availability: "",
      isVisible: true,
      informationComments: "",
      socialNetworks: [],
      importResumes: false,
      importFiles: false,
      importContractFiles: false,
      importContract: false,
      importFields: [],
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidateData(prevState => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!candidateData.attributes.firstName || !candidateData.attributes.lastName) {
      setErrorMessage("Les champs Prénom et Nom sont obligatoires.");
      toast.error("Les champs Prénom et Nom sont obligatoires.");
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
        "https://ui.boondmanager.com/api/candidates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({ data: candidateData })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        setErrorMessage("");
        toast.success("Candidat créé avec succès !");
        onCandidateCreated(); // Lever l'état pour indiquer la création
      } else {
        console.log("Requête en échec avec un statut HTTP " + response.status);
        toast.error("Erreur lors de la création du candidat.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      toast.error("Erreur lors de la requête API.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <FormControl fullWidth margin="normal">
        <FormLabel>Prénom</FormLabel>
        <Input
          type="text"
          name="firstName"
          value={candidateData.attributes.firstName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Nom</FormLabel>
        <Input
          type="text"
          name="lastName"
          value={candidateData.attributes.lastName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Fonction</FormLabel>
        <Input
          type="text"
          name="title"
          value={candidateData.attributes.title}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Créer
      </Button>
    </Box>
  );
};

CreateCandidateForm.propTypes = {
  onCandidateCreated: PropTypes.func.isRequired,
};

export default CreateCandidateForm;
