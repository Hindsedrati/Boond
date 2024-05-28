import { useState, useEffect } from 'react';
import { jwtEncode } from './utils/utils';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Candiatelist from './components/candidate/Candiatelist';
import CreateCandidateForm from './components/candidate/CreateCandidateForm';
import UpdateCandidateForm from './components/candidate/UpdateCandidateForm';
import DeleteCandidateForm from './components/candidate/DeleteCandidateForm';

import Contactlist from './components/contact/Contactlist';
import CreateContactForm from './components/contact/CreateContactForm';
import UpdateContactForm from './components/contact/UpdateContactForm';
import DeleteContactForm from './components/contact/DeleteContactForm';

import Projectlist from './components/project/Projectlist';
import CreateProjectForm from './components/project/CreateProjectForm';
import UpdateProjectForm from './components/project/UpdateProjectForm';
import DeleteProjectForm from './components/project/DeleteProjectForm';

import Resourcelist from './components/resource/Resourcelist';
import CreateResourceForm from './components/resource/CreateResourceForm';
import UpdateResourceForm from './components/resource/UpdateResourceForm';
import DeleteResourceForm from './components/resource/DeleteResourceForm';

import Header from './components/Header';
import Home from './components/Home';

const ClientToken = "6e616f706c61795f73616e64626f78";
const ClientKey = "4488aa91d7a63630e391";
const UserToken = "332e6e616f706c61795f73616e64626f78";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const states = {
    Prospect: 0,
    Client: 1,
    Suspect: 2,
    "Contact administratif ou relai": 3,
    "Potentiel Partenaire": 4,
    Partenaire: 7,
    Archivé: 8,
    Fournisseur: 9
  };

  useEffect(() => {
    const callApi = async () => {
      try {
        const payload = {
          userToken: UserToken,
          clientToken: ClientToken,
          time: Math.floor(Date.now() / 1000),
          mode: 'normal'
        };

        const jwtToken = jwtEncode(payload, ClientKey);

        const fetchData = async (url) => {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }

          return await response.json();
        };

        const [candidates, contacts, companies, projects, resources] = await Promise.all([
          fetchData('https://ui.boondmanager.com/api/candidates'),
          fetchData('https://ui.boondmanager.com/api/contacts'),
          fetchData('https://ui.boondmanager.com/api/companies'),
          fetchData('https://ui.boondmanager.com/api/projects'),
          fetchData('https://ui.boondmanager.com/api/resources')
        ]);

        setUserData(candidates);
        setContactData(contacts);
        setCompanyData(companies.data);
        setProjectData(projects);
        setResourceData(resources.data.map(resource => ({
          ...resource,
          id: Number(resource.id)
        })));

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la requête API:', error);
        setLoading(false);
      }
    };

    callApi();
  }, [reload]);

  const handleReload = () => setReload(!reload);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!userData || !contactData || !companyData || !projectData || !resourceData) {
    return <p>Erreur lors de la récupération des données.</p>;
  }

  return (
    <div>
      <Router>
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/candidates" element={
                <>
                  <Candiatelist candidates={userData.data} />
                  <CreateCandidateForm onCandidateCreated={handleReload} />
                  <UpdateCandidateForm onCandidateUpdated={handleReload} />
                  <DeleteCandidateForm onCandidateDeleted={handleReload} />
                </>
              } />
              <Route path="/contacts" element={
                <>
                  <Contactlist contacts={contactData.data} companies={companyData} states={states} />
                  <CreateContactForm onContactCreated={handleReload} companies={companyData} states={states} />
                  <UpdateContactForm onContactUpdated={handleReload} companies={companyData} states={states} />
                  <DeleteContactForm onContactDeleted={handleReload} />
                </>
              } />
              <Route path="/projects" element={
                <>
                  <Projectlist projects={projectData.data} />
                  <CreateProjectForm onProjectCreated={handleReload} contacts={contactData.data} companies={companyData} resources={resourceData} />
                  <UpdateProjectForm onProjectUpdated={handleReload} contacts={contactData.data} companies={companyData} resources={resourceData} />
                  <DeleteProjectForm onProjectDeleted={handleReload} />
                </>
              } />
              <Route path="/resources" element={
                <>
                  <Resourcelist resources={resourceData} />
                  <CreateResourceForm onResourceCreated={handleReload} />
                  <UpdateResourceForm onResourceUpdated={handleReload} />
                  <DeleteResourceForm onResourceDeleted={handleReload} />
                </>
              } />
            </Routes>
          </div>
        </main>
      </Router>
    </div>
  );
};

export default App;
