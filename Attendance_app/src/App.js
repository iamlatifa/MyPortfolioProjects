import React from "react";
import { useState,useEffect } from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoadingSpinner from "./components/LoadingSpinner";
import {Home} from './components/Home';
import {Logout} from './components/logout';
import Login from "./components/login";
import Filiere from "./components/Filiere";
import Groupe from "./components/Groupe";
import Salle from "./components/salle";
import Filter from "./components/filter";
import Stagiaire from "./components/Stagiaire";
import Navbar from "./navigation/formateurnavbar";
import Profile from "./components/profile";
import ListeAbsenceFormateur from './components/ListeAbsenceFormateur';
import StudentModal from "./components/Models/StudentModel";
import Lister from "./components/Lister";
import {HomeView} from './interceptors/api'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListeAbsenceAdmin from "./components/ListeAbsenceAdmin";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Formateur from "./components/Formateur";
import ArchiveAbsence from "./components/ArchiveAbsence";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Anne from "./components/Anne";
import Footer from "./components/Footers/Footer"


export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState({});
  const [toggle, setToggle] = useState(true);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const data = await HomeView();
        setHomeData(data);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  if (homeData.isadmin) {
    return (
      <BrowserRouter>
      <Navbar toggle={handleToggle} />
              <Routes>
                <Route path="/Année" element={<Anne/>} />
              <Route path="/ListeAbsence" element={<ListeAbsenceAdmin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/filieres" element={<Filiere />} />
                <Route path="/AdminSearch" element={<Filter />} />
                <Route path="/groupes" element={<Groupe />} />
                <Route path="/formateurs" element={<Formateur />} />
                <Route path="/salles" element={<Salle />} />
                <Route path="/stagiaires" element={<Stagiaire />} />
                <Route path="logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />}/>
                <Route path="/salles" element={<Salle />}/>
                <Route path="/DetailsAbsences" element={<ArchiveAbsence />}/>
                </Routes>
                <ToastContainer />
                <Footer/>

      </BrowserRouter>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          {isAuth ? (
            <>
              <Navbar toggle={handleToggle} />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/Lister" element={<Lister />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />}/>
                <Route path="/saisieAbsence" element={<Filter />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ListeAbsence" element={<ListeAbsenceFormateur />} />
                <Route path="/editAbsence" element={<StudentModal />} />
                <Route path="/stagiaires" element={<Stagiaire />} />
              </Routes>
              <ToastContainer />
              <Footer/>
            </>
          ) : (
            <Login />
          )}
        </BrowserRouter>
        </>
        )
    };
  };