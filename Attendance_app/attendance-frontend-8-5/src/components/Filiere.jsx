import React from "react";
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan,faEdit,faLoader} from '@fortawesome/free-solid-svg-icons';
import { GetFilieres ,DeleteFiliere} from '../interceptors/api';
import AddFiliereModal from '../components/Models/AjouteFilière';
import UpdateFiliereModal from '../components/Models/ModifierFiliere'
import { toast } from 'react-toastify';
import LoadingSpinner from "./LoadingSpinner";
import { Button, IconButton } from "@material-tailwind/react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export default function Filiere(){
    const [isLoading, setIsLoading] = useState(true);
    const [filieres, setFilieres] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editStudent, setEditStudent] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items to show per page
  
    useEffect(() => {
        const year = localStorage.getItem('year');
          const fetchData = async () => {
            try {
              const data = await GetFilieres(year);
              setFilieres(data);
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
  const handleUpdate = (e, stu) => {
    e.preventDefault();
    setEditModalShow(true);
    setEditStudent(stu);
  };
    const handleAdd = (e) => {
        e.preventDefault();
        setAddModalShow(true);
    };

    const handleDelete = (e, id) => {
        if(window.confirm('Êtes-vous sûr ?')){
            e.preventDefault();
            DeleteFiliere(id)
            .then((result)=>{
                toast.success(result);
                const updatedFilieres = filieres.filter((filiere) => filiere.id !== id);
                setFilieres(updatedFilieres);
            },
            (error)=>{
                toast.error("la suppression est échoué");
            })
        }
    };


    let AddModelClose=()=>setAddModalShow(false);
    let EditModelClose=()=>setEditModalShow(false);

// Pagination
const totalPages = Math.ceil(filieres.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, filieres.length);

// ... Rest of the component

const getItemProps = (index) => ({
  variant: currentPage === index ? "filled" : "text",
  color: currentPage === index ? "green" : "blue",
  onClick: () => setCurrentPage(index),
  className: "rounded-full w-8 h-8 flex items-end justify-center",
  children: index === 0 ? "Page 1" : index, // Show "Page 1" for the first button (index 0)
});


// Previous and Next functions
const prev = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
const next = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages ));

// Pagination buttons array
const paginationButtons = Array.from({ length: totalPages }, (_, index) => index + 1);


return(
<>
        {filieres.length === 0 ? (
  <div className='flex justify-center item-center'>
    <Card className=" w-full max-w-[20rem] text-center p-8 bg-red-400 border-1 border-red-600 rounded shadow-lg">
  <CardBody>
    <Typography variant="h5" color="white" className="mb-2">
    merci de choisir l'année
    </Typography>
    <Typography color="white">
      Aucune donnée trouvé ! veuillez choisie une année
    </Typography>
  </CardBody>
  <CardFooter className="pt-0">
  </CardFooter>
</Card>  
</div>   

) : ( 
  <div className="relative overflow-x-auto shadow-md rounded m-2 ">
  <div className="relative overflow-x-auto border-1 border-gray-200 rounded-t">
{/* Pagination */}
{filieres.length > itemsPerPage && (
            <div className="h-10 m-2 grid grid-cols-5 content-center">
              <p className="self-center font-semibold">
                Total  {filieres.length }</p>
              <Button
                variant="text"
                color="cayan"
                className="col-start-2 items-center justify-end gap-2 rounded-full"
                onClick={prev}
                disabled={currentPage === 1}>
                <span aria-hidden="true">
                  <i class="fa-solid fa-arrow-left"></i>
                </span>
              </Button>
              <div className="flex col-start-3 items-center justify-center">
                {paginationButtons.map((page) => (
                  <IconButton
                    key={page}
                    {...getItemProps(page)}>
                    {page}
                  </IconButton>
                ))}
              </div>
              <Button
                variant="text"
                className="col-start-4 items-center gap-2 rounded-full"
                onClick={next}
                disabled={currentPage === totalPages}
              >
                <span aria-hidden="true" >
                  <i class="fa-solid fa-arrow-right"></i>  </span>
              </Button>
              <div class="relative m-1 flex w-full flex-wrap justify-end items-stretch">
              <button onClick={handleAdd}
          className="w-1/2 rounded bg-primary-500 py-1 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          type="button"
                      
                    >
                      Ajouter Filière
                    </button>
                    <AddFiliereModal show={addModalShow} setUpdated={setIsUpdated}
                onHide={AddModelClose}>
</AddFiliereModal>
                  </div>
            </div>
          )}
        </div>
        <table className="w-full text-md  text-gray-600 table-auto ">
        <thead className="text-xs text-white uppercase bg-green-500 shadow-md ">
            <tr >
                <th class="px-6 py-1">
                   Id
                </th>
                
                <th class="px-6 py-1 text-center">
                    Titulier
                </th>
                <th class="px-6 py-1 text-center">
                    code filiere 
                </th>
                <th class="px-6 py-1 text-center">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
        {filieres.slice(startIndex, endIndex).map((item, index) => {
            return(
                <tr class="bg-white border-b hover:bg-gray-200 dark:hover:bg-gray-600">
                <td class="px-6 py-1">
                    {item.id}
                </td>
                <td class="px-6 py-1">
                    {item.nom}
                </td>
                <td class="px-8 py-1 text-center">
                    {item.codefiliere}
                </td>
                <td class="px-4  text-red-600 text-center" style={{'color':'#6590D5'}}>
                    <button className="focus:outline-none mx-5" onClick={event => handleDelete(event,item.id)}>
                    <FontAwesomeIcon icon={faTrashCan} size="lg"/> 
                    </button>
               
                <button className="focus:outline-none" 
                onClick={e=>handleUpdate(e,item.id)}>
                <FontAwesomeIcon icon={faEdit} size="lg"/>
                </button>
                </td>
            </tr>
            )
        })}
             <UpdateFiliereModal show={editModalShow} id={editStudent} setUpdated={setIsUpdated}
                              onHide={EditModelClose}></UpdateFiliereModal>
            
            
        </tbody>
    </table>
    </div>
)}
</>

);

}