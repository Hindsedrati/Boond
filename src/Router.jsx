import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Candidates from './components/candidate/Candiatelist';
import CreateCandidateForm from './components/candidate/CreateCandidateForm';
import UpdateCandidateForm from './components/candidate/UpdateCandidateForm';
import DeleteCandidateForm from './components/candidate/DeleteCandidateForm';
import Contacts from './components/contact/Contactlist';
import CreateContactForm from './components/contact/CreateContactForm';
import UpdateContactForm from './components/contact/UpdateContactForm';
import DeleteContactForm from './components/contact/DeleteContactForm';
import Projects from './components/project/Projectlist';
import CreateProjectForm from './components/project/CreateProjectForm';
import UpdateProjectForm from './components/project/UpdateProjectForm';
import DeleteProjectForm from './components/project/DeleteProjectForm';
import Resources from './components/resource/ResourceList';
import CreateResourceForm from './components/resource/CreateResourceForm';
import UpdateResourceForm from './components/resource/UpdateResourceForm';
import DeleteResourceForm from './components/resource/DeleteResourceForm';
import Header from './components/Header';

const AppRouter = (props) => {
  const {
    userData,
    contactData,
    companyData,
    projectData,
    resourceData,
    handleCandidateCreated,
    handleCandidateUpdated,
    handleCandidateDeleted,
    handleContactCreated,
    handleContactUpdated,
    handleContactDeleted,
    handleProjectCreated,
    handleProjectUpdated,
    handleProjectDeleted,
    handleResourceCreated,
    handleResourceUpdated,
    handleResourceDeleted,
    states,
  } = props;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/candidates"
          element={
            <Candidates
              candidates={userData.data}
            />
          }
        />
        <Route
          path="/create-candidate"
          element={<CreateCandidateForm onCandidateCreated={handleCandidateCreated} />}
        />
        <Route
          path="/update-candidate"
          element={<UpdateCandidateForm onCandidateUpdated={handleCandidateUpdated} />}
        />
        <Route
          path="/delete-candidate"
          element={<DeleteCandidateForm onCandidateDeleted={handleCandidateDeleted} />}
        />
        <Route
          path="/contacts"
          element={
            <Contacts
              contacts={contactData.data}
              companies={companyData}
              states={states}
            />
          }
        />
        <Route
          path="/create-contact"
          element={
            <CreateContactForm
              onContactCreated={handleContactCreated}
              companies={companyData}
              states={states}
            />
          }
        />
        <Route
          path="/update-contact"
          element={
            <UpdateContactForm
              onContactUpdated={handleContactUpdated}
              companies={companyData}
              states={states}
            />
          }
        />
        <Route
          path="/delete-contact"
          element={<DeleteContactForm onContactDeleted={handleContactDeleted} />}
        />
        <Route
          path="/projects"
          element={
            <Projects
              projects={projectData.data}
            />
          }
        />
        <Route
          path="/create-project"
          element={<CreateProjectForm onProjectCreated={handleProjectCreated} />}
        />
        <Route
          path="/update-project"
          element={<UpdateProjectForm onProjectUpdated={handleProjectUpdated} />}
        />
        <Route
          path="/delete-project"
          element={<DeleteProjectForm onProjectDeleted={handleProjectDeleted} />}
        />
        <Route
          path="/resources"
          element={
            <Resources
              resources={resourceData.data}
            />
          }
        />
        <Route
          path="/create-resource"
          element={<CreateResourceForm onResourceCreated={handleResourceCreated} />}
        />
        <Route
          path="/update-resource"
          element={<UpdateResourceForm onResourceUpdated={handleResourceUpdated} />}
        />
        <Route
          path="/delete-resource"
          element={<DeleteResourceForm onResourceDeleted={handleResourceDeleted} />}
        />
      </Routes>
    </Router>
  );
};

AppRouter.propTypes = {
  userData: PropTypes.object.isRequired,
  contactData: PropTypes.object.isRequired,
  companyData: PropTypes.array.isRequired,
  projectData: PropTypes.object.isRequired,
  resourceData: PropTypes.object.isRequired,
  handleCandidateCreated: PropTypes.func.isRequired,
  handleCandidateUpdated: PropTypes.func.isRequired,
  handleCandidateDeleted: PropTypes.func.isRequired,
  handleContactCreated: PropTypes.func.isRequired,
  handleContactUpdated: PropTypes.func.isRequired,
  handleContactDeleted: PropTypes.func.isRequired,
  handleProjectCreated: PropTypes.func.isRequired,
  handleProjectUpdated: PropTypes.func.isRequired,
  handleProjectDeleted: PropTypes.func.isRequired,
  handleResourceCreated: PropTypes.func.isRequired,
  handleResourceUpdated: PropTypes.func.isRequired,
  handleResourceDeleted: PropTypes.func.isRequired,
  states: PropTypes.object.isRequired,
};

export default AppRouter;
