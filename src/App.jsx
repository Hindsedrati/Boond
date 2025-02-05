import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtEncode } from "./utils/utils";

import Candiatelist from "./components/candidate/Candidatelist";
import CreateCandidateForm from "./components/candidate/CreateCandidateForm";
import UpdateCandidateForm from "./components/candidate/UpdateCandidateForm";
import DeleteCandidateForm from "./components/candidate/DeleteCandidateForm";

import Contactlist from "./components/contact/Contactlist";
import CreateContactForm from "./components/contact/CreateContactForm";
import UpdateContactForm from "./components/contact/UpdateContactForm";
import DeleteContactForm from "./components/contact/DeleteContactForm";

import Header from "./components/Header";
import Home from "./components/Home";

const ClientToken = "6e616f706c61795f73616e64626f78";
const ClientKey = "4488aa91d7a63630e391";
const UserToken = "332e6e616f706c61795f73616e64626f78";

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const states = {
    0: "Prospect",
    1: "Client",
    2: "Suspect",
    3: "Contact administratif",
    4: "Potentiel Partenaire",
    7: "Partenaire",
    8: "Archivé",
    9: "Fournisseur",
  };

  // ✅ Fonction pour récupérer les données de l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: "normal",
      };

      const jwtToken = jwtEncode(payload, ClientKey);
      const headers = { "X-Jwt-Client-Boondmanager": jwtToken };

      const endpoints = {
        candidates: "https://ui.boondmanager.com/api/candidates",
        contacts: "https://ui.boondmanager.com/api/contacts",
        companies: "https://ui.boondmanager.com/api/companies",
      };

      const responses = await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          const response = await fetch(url, { method: "GET", headers });
          if (!response.ok) throw new Error(`❌ Erreur chargement ${key}`);
          return { key, data: await response.json() };
        })
      );

      responses.forEach(({ key, data }) => {
        console.log(`✅ API Response ${key}:`, data);
        switch (key) {
          case "candidates":
            setCandidates(data.data || []);
            break;
          case "contacts":
            setContacts(data.data || []);
            break;
          case "companies":
            setCompanies(data.data || []);
            break;
          default:
            break;
        }
      });

      setLoading(false);
    } catch (error) {
      console.error("❌ API request error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  // ✅ Rafraîchir les données
  const handleReload = () => setReload(!reload);

  // ✅ Suppression d'un candidat
  const handleDeleteCandidate = async (candidateId) => {
    console.log("🗑️ Suppression du candidat ID:", candidateId);
    if (!candidateId) {
      alert("ID du candidat invalide !");
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

      if (!response.ok) {
        throw new Error(`❌ Erreur DELETE: ${response.status}`);
      }

      alert(`✅ Candidat ${candidateId} supprimé !`);
      handleReload();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression !");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <Router>
      <Header />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/candidates"
              element={
                <>
                  <Candiatelist
                    candidates={candidates}
                    onDeleteCandidate={(id) => {
                      setCandidateToDelete(id);
                      setShowDeleteModal(true);
                    }}
                  />
                  <CreateCandidateForm onCandidateCreated={handleReload} />
                </>
              }
            />

            <Route
              path="/contacts"
              element={
                companies.length > 0 && states ? (
                  <>
                    <Contactlist contacts={contacts} companies={companies} states={states} />
                    <CreateContactForm onContactCreated={handleReload} companies={companies} states={states} />
                    <UpdateContactForm onContactUpdated={handleReload} companies={companies} states={states} />
                    <DeleteContactForm onContactDeleted={handleReload} />
                  </>
                ) : (
                  <p>⚠️ Chargement des contacts...</p>
                )
              }
            />
          </Routes>
        </div>
      </main>

      {showDeleteModal && candidateToDelete && (
        <DeleteCandidateForm
          candidateId={candidateToDelete}
          onCandidateDeleted={handleReload}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </Router>
  );
};

export default App;
