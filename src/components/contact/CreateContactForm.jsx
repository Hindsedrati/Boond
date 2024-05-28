// src/components/contact/CreateContactForm.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import { jwtEncode } from "../../utils/utils";

const CreateContactForm = ({ onContactCreated, companies, states }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [contactData, setContactData] = useState({
    type: "contact",
    attributes: {
      firstName: "",
      lastName: "",
      email1: "",
      phone1: "",
      function: "",
      state: "",
    },
    relationships: {
      company: {
        data: {
          type: "company",
          id: ""
        }
      }
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContactData(prevState => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleCompanyChange = (event) => {
    const { value } = event.target;
    setContactData(prevState => ({
      ...prevState,
      relationships: {
        company: {
          data: {
            ...prevState.relationships.company.data,
            id: value
          }
        }
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email1, phone1 } = contactData.attributes;
    const { id: companyId } = contactData.relationships.company.data;

    if (!firstName || !lastName || !email1 || !phone1 || !companyId) {
      setErrorMessage("Tous les champs sont obligatoires.");
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
      console.log("Contact data being sent:", contactData);
      
      const response = await fetch(
        "https://ui.boondmanager.com/api/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({ data: contactData })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        setErrorMessage("");
        onContactCreated();
        toast.success("Contact créé avec succès !");
      } else {
        const errorText = await response.text();
        console.log("Requête en échec avec un statut HTTP " + response.status, errorText);
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}: ${errorText}`);
        toast.error("Erreur lors de la création du contact !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la création du contact !");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <FormControl fullWidth margin="normal">
        <FormLabel>Prénom</FormLabel>
        <Input
          type="text"
          name="firstName"
          value={contactData.attributes.firstName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Nom</FormLabel>
        <Input
          type="text"
          name="lastName"
          value={contactData.attributes.lastName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email1"
          value={contactData.attributes.email1}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Téléphone</FormLabel>
        <Input
          type="text"
          name="phone1"
          value={contactData.attributes.phone1}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Fonction</FormLabel>
        <Input
          type="text"
          name="function"
          value={contactData.attributes.function}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>État</FormLabel>
        <Select name="state" value={contactData.attributes.state} onChange={handleInputChange}>
          <MenuItem value="">Sélectionnez un état</MenuItem>
          {Object.keys(states).map(stateKey => (
            <MenuItem key={states[stateKey]} value={states[stateKey]}>
              {stateKey}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Société</FormLabel>
        <Select name="company" value={contactData.relationships.company.data.id} onChange={handleCompanyChange}>
          <MenuItem value="">Sélectionnez une société</MenuItem>
          {companies.map(company => (
            <MenuItem key={company.id} value={company.id}>
              {company.attributes.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Créer
      </Button>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
    </Box>
  );
};

CreateContactForm.propTypes = {
  onContactCreated: PropTypes.func.isRequired,
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  states: PropTypes.object.isRequired, // Validation de la prop states
};

export default CreateContactForm;
