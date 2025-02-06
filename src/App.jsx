import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtEncode } from "./utils/utils";

import Candiatelist from "./components/candidate/Candidatelist";
import CreateCandidateForm from "./components/candidate/CreateCandidateForm";
import DeleteCandidateForm from "./components/candidate/DeleteCandidateForm";

import Contactlist from "./components/contact/Contactlist";
import CreateContactForm from "./components/contact/CreateContactForm";
import UpdateContactForm from "./components/contact/UpdateContactForm";
import DeleteContactForm from "./components/contact/DeleteContactForm";

import Projectlist from "./components/project/Projectlist";
import CreateProjectForm from "./components/project/CreateProjectForm";
import UpdateProjectForm from "./components/project/UpdateProjectForm";
import DeleteProjectForm from "./components/project/DeleteProjectForm";

import Resourcelist from "./components/resource/Resourcelist";
import CreateResourceForm from "./components/resource/CreateResourceForm";
import UpdateResourceForm from "./components/resource/UpdateResourceForm";
import DeleteResourceForm from "./components/resource/DeleteResourceForm";

import ReportingCompanies from "./components/reporting/ReportingCompanies";
import ReportingProductionPlans from "./components/reporting/ReportingProductionPlans";
import ReportingProjects from "./components/reporting/ReportingProjects";
import ReportingResources from "./components/reporting/ReportingResources";

import Header from "./components/Header";
import Home from "./components/Home";

const ClientToken = "6e616f706c61795f73616e64626f78";
const ClientKey = "4488aa91d7a63630e391";
const UserToken = "332e6e616f706c61795f73616e64626f78";

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // ✅ Récupération des données API
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
        projects: "https://ui.boondmanager.com/api/projects",
        resources: "https://ui.boondmanager.com/api/resources",
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
          case "projects":
            setProjects(data.data || []);
            break;
          case "resources":
            setResources(data.data || []);
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
  }, []);

  // ✅ Suppression d'un candidat avec mise à jour immédiate
  // ✅ Fonction pour supprimer un candidat et mettre à jour la liste
  const handleDeleteCandidate = async (id) => {
    if (!id) return;
    if (!window.confirm(`Voulez-vous vraiment supprimer le candidat ${id} ?`)) return;
  
    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: "normal",
      };
  
      const jwtToken = jwtEncode(payload, ClientKey);
      const response = await fetch(`https://ui.boondmanager.com/api/candidates/${id}`, {
        method: "DELETE",
        headers: { "X-Jwt-Client-Boondmanager": jwtToken },
      });
  
      if (!response.ok) throw new Error(`Erreur DELETE: ${response.status}`);
  
      alert(`✅ Candidat ${id} supprimé avec succès !`);
  
      // 🔄 **Forcer la mise à jour après suppression**
      setCandidates(prev => prev.filter(candidate => candidate.id !== id));
  
      // ✅ Optionnel : Vérifier si `fetchData` est nécessaire
      // await fetchData(); 
  
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
                  <CreateCandidateForm onCandidateCreated={fetchData} />
                </>
              }
            />

            <Route
              path="/contacts"
              element={
                companies.length > 0 && states ? (
                  <>
                    <Contactlist contacts={contacts} companies={companies} states={states} />
                    <CreateContactForm onContactCreated={fetchData} companies={companies} states={states} />
                    <UpdateContactForm onContactUpdated={fetchData} companies={companies} states={states} />
                    <DeleteContactForm onContactDeleted={fetchData} />
                  </>
                ) : (
                  <p>⚠️ Chargement des contacts...</p>
                )
              }
            />

            <Route
              path="/projects"
              element={
                <>
                  <Projectlist projects={projects} />
                  <CreateProjectForm onProjectCreated={fetchData} />
                  <UpdateProjectForm onProjectUpdated={fetchData} />
                  <DeleteProjectForm onProjectDeleted={fetchData} />
                </>
              }
            />

            <Route
              path="/resources"
              element={
                <>
                  <Resourcelist resources={resources} />
                  <CreateResourceForm onResourceCreated={fetchData} />
                  <UpdateResourceForm onResourceUpdated={fetchData} />
                  <DeleteResourceForm onResourceDeleted={fetchData} />
                </>
              }
            />

            <Route path="/reporting-companies" element={<ReportingCompanies />} />
            <Route path="/reporting-production-plans" element={<ReportingProductionPlans />} />
            <Route path="/reporting-projects" element={<ReportingProjects />} />
            <Route path="/reporting-resources" element={<ReportingResources />} />
          </Routes>
        </div>
      </main>

      {/* ✅ Popup suppression */}
      {showDeleteModal && candidateToDelete && (
        <DeleteCandidateForm
          candidateId={candidateToDelete}
          onCandidateDeleted={handleDeleteCandidate}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </Router>
  );
};

export default App;
