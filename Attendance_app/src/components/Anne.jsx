import React, { useEffect, useState } from "react";
import { HomeView, GetAnnee } from "../interceptors/api";
import "../popup.css";

export default function Anne() {
  const [isLoading, setIsLoading] = useState(true);
  const [annee, setAnnee] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(selectedYear === "");

  const saveSelectedYearIdToLocalStorage = (yearId) => {
    localStorage.setItem("year", yearId);
  };


  useEffect(() => {
    const selectedYearId = localStorage.getItem("year");
    if (selectedYearId) {
      setSelectedYear(selectedYearId);
    }
    const GetData = async () => {
      try {
        const data = await HomeView();
        setUser(data);
        const data2 = await GetAnnee();
        setAnnee(data2);
        setIsLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setIsLoading(false);
      }
    };
    GetData();
  }, []);

  useEffect(() => {
    // Update the isPopUpOpen state based on selectedYear
    setIsPopUpOpen(selectedYear === "");
  }, [selectedYear]);

  const handleYearChange = (event) => {
    const selectedYearId = event.target.value;
    setSelectedYear(selectedYearId);
    saveSelectedYearIdToLocalStorage(selectedYearId);
    window.location.reload();
  };

  return (
    <div className="pl-2">
      {user.isadmin && (
        <div>
          <select
            className={`px-3 mx-auto my-3 border border-gray-500 focus:outline-none rounded hover:bg-gray-300 ${
              selectedYear ? "" : "select-error"
            }`}
            value={selectedYear}
            onChange={handleYearChange}
            required
          >
            <option disabled value="">
              Année
            </option>
            {annee.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.annee}
                </option>
              );
            })}
          </select>
        </div>
      )}

{isPopUpOpen && user.isadmin && (
        <div className="popup">
          <div className="popup-content">
              <div>
                <p>Sélectionner l'Année scolaire</p>
                <div className="text-center">
                <select
                  className={`px-3 mx-auto my-3 border border-gray-500 focus:outline-none rounded hover:bg-gray-300 ${
                    selectedYear ? "" : "select-error"
                  }`}
                  value={selectedYear}
                  onChange={handleYearChange}
                  required
                >
                  <option disabled value="">
                  Sélectionner
                  </option>
                  {annee.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.annee}
                      </option>
                    );
                  })}
                </select>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
