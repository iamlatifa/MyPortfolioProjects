import { useEffect, useState } from "react";
import { faLoader } from '@fortawesome/free-solid-svg-icons';
import { HomeView } from '../interceptors/api';
import LoadingSpinner from "./LoadingSpinner";
import React from "react";
// components
import CardStats from "./Cards/CardStats";
import { GetStagiaires, GetAbsences, GeRetards ,GetSalles} from '../interceptors/api';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const year = localStorage.getItem('year');
export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [home, setHome] = useState('');
  const [stagiaires, setStagiaires] = useState('');
  const [absences, setAbsences] = useState([]);
  const [retards, setRetards] = useState([]);
  const [salles, setSalles] = useState([]);
  const [invalidAbsences, setInvalidAbsences] = useState([]);
  const [invalidRetards, setInvalidRetards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await HomeView();
        setHome(data);
        console.log("home",home)
        const data2 = await GetStagiaires(year);
        setStagiaires(data2);
        const data3 = await GetSalles(year);
                setSalles(data3);
        const [allAbsences, allRetards] = await Promise.all([
          GetAbsences(year),
          GeRetards(year),
        ]);

        // Filter absences and retards with isvalid = true
        const validAbsences = allAbsences.filter((absence) => absence.isvalid);
        const validRetards = allRetards.filter((retard) => retard.isvalid);
        const invalidAbsences = allAbsences.filter((absence) => !absence.isvalid);
        const invalidRetards = allRetards.filter((retard) => !retard.isvalid);

        setAbsences(validAbsences);
        setRetards(validRetards);
        setInvalidAbsences(invalidAbsences);
        setInvalidRetards(invalidRetards);

        setIsLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>

    {home.isadmin? (
<>
<p className="m-2 text-gray-600">Admin Dashbord</p>
       <div className="flex flex-wrap justify-center p-6">
        <div className="grid grid-cols-3 xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardStats
            statSubtitle={'totale stagiaire'}
            statIconName={'fa-solid fa-user'}
            statTitle={stagiaires.length}
            statIconColor={"bg-gray-400"}

          />
          <CardStats
            statSubtitle={'totale salle'}
            statTitle={salles.length}
            statIconName={'fas fa-chart-bar'}
            statIconColor={"bg-gray-400"}
          />
          <CardStats
            statSubtitle={'totale retard valider'}
            statTitle={retards.length}
            statIconName={'fas fa-chart-bar'}
            statIconColor={"bg-sky-400"}

          />
          <CardStats
            statSubtitle={'totale absence valider'}
            statTitle={absences.length}
            statIconName={'fas fa-chart-bar'}
            statIconColor={"bg-green-400"}

          />
          <CardStats
            statSubtitle={'totale absence'}
            statTitle={invalidAbsences.length}
            statIconName={'fas fa-chart-bar'}
            statIconColor={"bg-green-400"}

          />
          <CardStats
            statSubtitle={'totale retard'}
            statTitle={invalidRetards.length}
            statIconName={'fas fa-chart-bar'}
            statIconColor={"bg-sky-400"}

          />
        </div>
      </div>
      </>):<div className='flex justify-center item-center'>
        <Card className=" w-full max-w-[20rem] p-8 bg-sky-300 rounded shadow-lg text-center">
      <CardBody>
        <Typography variant="h5" color="white" className="mb-2">
        Bienvenu
        </Typography>
        <Typography color="white">
        {home.nom} {home.prenom}       </Typography>
      </CardBody>
      <CardFooter className="pt-0">
      </CardFooter>
    </Card>  
        </div>
         } 
    </>
  );
}
export default Home;
