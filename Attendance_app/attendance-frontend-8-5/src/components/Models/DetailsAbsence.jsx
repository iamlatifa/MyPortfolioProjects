import React from 'react';
import { Modal} from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { PutDeactivateStagiaire, PutJustification } from  '../../interceptors/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faX, faCheck } from '@fortawesome/free-solid-svg-icons';


export default function DetailsAbsence(props) {
    const year = localStorage.getItem('year');


      const handleJustifyAbsence= async (id, stagiaireId) => {
        try {
          const result = await PutJustification(id, stagiaireId);
          localStorage.setItem('alertMessage', result);
          window.location.reload();
        } catch (error) {
          toast.error('Erreur du serveur');
          console.error(error);
        }
      };

      const handleDeactivateStagiaire = async (id) => {
        try {
        const result = await PutDeactivateStagiaire(id);
            localStorage.setItem('alertMessage', result);
            window.location.reload();
          }catch(error) {
            toast.error('Erreur du serveur');
            console.log(error);
          };
      };
 
    return (
        <div className="container">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Details Absence
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table className='bg-green-500 text-white'>
                <thead>
                    <tr>
                    <th className="px-auto py-2">
                        Nom et Prénom
                    </th>
                    <th className="px-auto py-2">
                        Justification
                    </th>
                    <th className="px-auto py-2">
                        Observation 
                    </th>
                    <th className="px-auto py-2">
                        Deactivate 
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                      <tr key={index} className={`${item.stagiaire.actif ? 'bg-white border-b hover:bg-gray-50' : 'bg-yellow-300'}`}>
                        <td className="px-6 py-2 text-gray-900">
                        {item.stagiaire.nom} {item.stagiaire.prenom}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.justified ? (
                        <button
                        className='bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-green-300 border-b-2 border-green-700 hover:border-green-500 rounded'
                          onClick={() => handleJustifyAbsence(item.id , item.stagiaire.id)} 
                          title="Cliquez pour Annuler la Justification de cette Absence">
                          <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: '#FFFFFF' }} />
                        </button>
                      ) : (
                        <button 
                        className='bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-red-300 border-b-2 border-red-700 hover:border-red-500 rounded'
                        onClick={() => handleJustifyAbsence(item.id, item.stagiaire.id)} 
                        title="Cliquez pour Justifier cette Absence.">
                          <FontAwesomeIcon icon={faX} size="lg" style={{'color':'#FFFFFF'}} />
                        </button>
                      )}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.observation ? item.observation : "-"}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.stagiaire.actif ? (
                        <button
                        className='bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-green-300 border-b-2 border-green-700 hover:border-green-500 rounded'
                          onClick={() => handleDeactivateStagiaire(item.stagiaire.id)} 
                          title="Cliquez pour Désactiver ce Stagiaire">
                          <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: '#FFFFFF' }} />
                        </button>
                      ) : (
                        <button
                        className='bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-red-300 border-b-2 border-red-700 hover:border-red-500 rounded'
                        onClick={() => handleDeactivateStagiaire(item.stagiaire.id)} 
                        title="Cliquez pour Réactiver ce Stagiaire">
                          <FontAwesomeIcon icon={faX} size="lg" style={{'color':'#FFFFFF'}} />
                        </button>
                      )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>
                    
                </Modal.Body>
                <Modal.Footer>
                <button  className="hover:text-red-700" onClick={props.onHide}>
                        Fermer
                    </button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};


