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

const UpdateContactForm = ({ companies, states, onContactUpdated }) => {
  
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [contactId, setContactId] = useState("");
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email1: "",
    phone1: "",
    function: "",
    state: "",
    companyId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContactData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCompanyChange = (event) => {
    const { value } = event.target;
    setContactData((prevState) => ({
      ...prevState,
      companyId: value,
    }));
  };

  const handleSearch = async () => {
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
        `https://ui.boondmanager.com/api/contacts/${contactId}/information`,
        {
          method: "GET",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const contact = result.data.attributes;
        const company = result.data.relationships.company.data;
        setContactData({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email1: contact.email1 || "",
          phone1: contact.phone1 || "",
          function: contact.function || "",
          state: contact.state || "",
          companyId: company ? company.id : "",
        });
        setErrorMessage("");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la récupération du contact !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la récupération du contact !");
    }
  };

  const handleSubmit = async (event) => {
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
        `https://ui.boondmanager.com/api/contacts/${contactId}/information`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({
            data: {
              type: "contact",
              id: contactId,
              attributes: {
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email1: contactData.email1,
                phone1: contactData.phone1,
                function: contactData.function,
                state: contactData.state,
              },
              relationships: {
                company: {
                  data: {
                    type: "company",
                    id: contactData.companyId,
                  },
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        onContactUpdated();
        setErrorMessage("");
        toast.success("Contact mis à jour avec succès !");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
        toast.error("Erreur lors de la mise à jour du contact !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
      toast.error("Erreur lors de la mise à jour du contact !");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <FormControl fullWidth margin="normal">
        <FormLabel>ID du contact</FormLabel>
        <Input
          type="text"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        />
        <Button type="button" onClick={handleSearch} variant="contained" color="primary">
          Rechercher
        </Button>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Prénom</FormLabel>
        <Input
          type="text"
          name="firstName"
          value={contactData.firstName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Nom</FormLabel>
        <Input
          type="text"
          name="lastName"
          value={contactData.lastName}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email1"
          value={contactData.email1}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Téléphone</FormLabel>
        <Input
          type="text"
          name="phone1"
          value={contactData.phone1}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>Fonction</FormLabel>
        <Input
          type="text"
          name="function"
          value={contactData.function}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel>État</FormLabel>
        <Select name="state" value={contactData.state} onChange={handleInputChange}>
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
        <Select
          name="company"
          value={contactData.companyId}
          onChange={handleCompanyChange}
        >
          <MenuItem value="">Sélectionnez une société</MenuItem>
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.attributes.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Mettre à jour
      </Button>
    </Box>
  );
};

UpdateContactForm.propTypes = {
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  states: PropTypes.object.isRequired,
  onContactUpdated: PropTypes.func.isRequired,
};

export default UpdateContactForm;
