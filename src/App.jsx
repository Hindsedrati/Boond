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

import Actionlist from './components/action/Actionlist';
import CreateActionForm from './components/action/CreateActionForm';
import UpdateActionForm from './components/action/UpdateActionForm';
import DeleteActionForm from './components/action/DeleteActionForm';

import ReportingCompanies from './components/reporting/ReportingCompanies';
import ReportingProductionPlans from './components/reporting/ReportingProductionPlans';
import ReportingProjects from './components/reporting/ReportingProjects';
import ReportingResources from './components/reporting/ReportingResources';

import Header from './components/Header';
import Home from './components/Home';

const ClientToken = "6e616f706c61795f73616e64626f78";
const ClientKey = "4488aa91d7a63630e391";
const UserToken = "332e6e616f706c61795f73616e64626f78";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [resourceData, setResourceData] = useState(null);
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

        const responseCandidates = await fetch(
          'https://ui.boondmanager.com/api/candidates',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (responseCandidates.ok) {
          const resultCandidates = await responseCandidates.json();
          console.log('API Response Candidates:', resultCandidates);
          setUserData(resultCandidates);
        } else {
          console.log('Request failed with HTTP status ' + responseCandidates.status);
        }

        const responseContacts = await fetch(
          'https://ui.boondmanager.com/api/contacts',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (responseContacts.ok) {
          const resultContacts = await responseContacts.json();
          console.log('API Response Contacts:', resultContacts);
          setContactData(resultContacts);
        } else {
          console.log('Request failed with HTTP status ' + responseContacts.status);
        }

        const responseCompanies = await fetch(
          'https://ui.boondmanager.com/api/companies',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (responseCompanies.ok) {
          const resultCompanies = await responseCompanies.json();
          console.log('API Response Companies:', resultCompanies);
          setCompanyData(resultCompanies.data);
        } else {
          console.log('Request failed with HTTP status ' + responseCompanies.status);
        }

        const responseProjects = await fetch(
          'https://ui.boondmanager.com/api/projects',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (responseProjects.ok) {
          const resultProjects = await responseProjects.json();
          console.log('API Response Projects:', resultProjects);
          setProjectData(resultProjects);
        } else {
          console.log('Request failed with HTTP status ' + responseProjects.status);
        }

        const responseResources = await fetch(
          'https://ui.boondmanager.com/api/resources',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (responseResources.ok) {
          const resultResources = await responseResources.json();
          console.log('API Response Resources:', resultResources);
          setResourceData(resultResources);
        } else {
          console.log('Request failed with HTTP status ' + responseResources.status);
        }

        setLoading(false);
      } catch (error) {
        console.error('API request error:', error);
        setLoading(false);
      }
    };

    callApi();
  }, [reload]);

  const handleCandidateCreated = () => {
    setReload(!reload);
  };

  const handleCandidateUpdated = () => {
    setReload(!reload);
  };

  const handleCandidateDeleted = () => {
    setReload(!reload);
  };

  const handleContactCreated = () => {
    setReload(!reload);
  };

  const handleContactUpdated = () => {
    setReload(!reload);
  };

  const handleContactDeleted = () => {
    setReload(!reload);
  };

  const handleProjectCreated = () => {
    setReload(!reload);
  };

  const handleProjectUpdated = () => {
    setReload(!reload);
  };

  const handleProjectDeleted = () => {
    setReload(!reload);
  };

  const handleResourceCreated = () => {
    setReload(!reload);
  };

  const handleResourceUpdated = () => {
    setReload(!reload);
  };

  const handleResourceDeleted = () => {
    setReload(!reload);
  };

  const handleActionCreated = () => {
    setReload(!reload);
  };

  const handleActionUpdated = () => {
    setReload(!reload);
  };

  const handleActionDeleted = () => {
    setReload(!reload);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData || !contactData || !companyData || !projectData || !resourceData) {
    return <p>Error fetching data.</p>;
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
                  <CreateCandidateForm onCandidateCreated={handleCandidateCreated} />
                  <UpdateCandidateForm onCandidateUpdated={handleCandidateUpdated} />
                  <DeleteCandidateForm onCandidateDeleted={handleCandidateDeleted} />
                </>
              } />
              <Route path="/contacts" element={
                <>
                  <Contactlist contacts={contactData.data} companies={companyData} states={states} />
                  <CreateContactForm onContactCreated={handleContactCreated} companies={companyData} states={states} />
                  <UpdateContactForm onContactUpdated={handleContactUpdated} companies={companyData} states={states} />
                  <DeleteContactForm onContactDeleted={handleContactDeleted} />
                </>
              } />
              <Route path="/projects" element={
                <>
                  <Projectlist projects={projectData.data} />
                  <CreateProjectForm onProjectCreated={handleProjectCreated} companies={companyData} contacts={contactData.data} resources={resourceData.data} />
                  <UpdateProjectForm onProjectUpdated={handleProjectUpdated} />
                  <DeleteProjectForm onProjectDeleted={handleProjectDeleted} />
                </>
              } />
              <Route path="/resources" element={
                <>
                  <Resourcelist resources={resourceData.data} />
                  <CreateResourceForm onResourceCreated={handleResourceCreated} />
                  <UpdateResourceForm onResourceUpdated={handleResourceUpdated} />
                  <DeleteResourceForm onResourceDeleted={handleResourceDeleted} />
                </>
              } />
              <Route path="/actions" element={
                <>
                  <Actionlist resources={resourceData.data} />
                  <CreateActionForm onActionCreated={handleActionCreated} />
                  <UpdateActionForm onActionUpdated={handleActionUpdated} />
                  <DeleteActionForm onActionDeleted={handleActionDeleted} />
                </>
              } />
              <Route path="/reporting-companies" element={<ReportingCompanies />} />
              <Route path="/reporting-production-plans" element={<ReportingProductionPlans />} />
              <Route path="/reporting-projects" element={<ReportingProjects />} />
              <Route path="/reporting-resources" element={<ReportingResources />} />
            </Routes>
          </div>
        </main>
      </Router>
    </div>
  );
};

export default App;
