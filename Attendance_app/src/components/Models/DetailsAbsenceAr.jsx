import React from 'react';
import { Modal} from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {PutJustification } from  '../../interceptors/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';


export default function DetailsAbsence(props) {
    const year = localStorage.getItem('year');
    const handleJustifyAbsence = async (id, stagiaireId) => {
        try {
          const result = await PutJustification(id, stagiaireId);
          toast.success(result)
          window.location.reload();

        //   props.refresh({ preventDefault: () => {} });
        //   props.RePopup({ preventDefault: () => {} }, props.data, "absence");
        } catch (error) {
          toast.error('Erreur du serveur');
          console.error(error);
        }
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
                Total: <strong className='text-red-500'>{props.data.length} Absences</strong>
                <Table className='bg-teal-400 text-white'>

                <thead>
                    <tr>
                    <th className="px-auto py-2">
                        Nom de Formateur
                    </th>
                    <th className="px-auto py-2">
                        Date
                    </th>
                    <th className="px-auto py-2">
                        Séance
                    </th>
                    <th className="px-auto py-2">
                        Observation 
                    </th>
                    <th className="px-auto py-2">
                        Justification
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-900">
                        {item.formateur}
                        </td>
                        <td className="px-6 py-2 text-gray-900">
                        {item.date}
                        </td>
                        <td className="px-6 py-2 text-gray-900">
                        {item.seance_debut}-{item.seance_fin}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.observation ? item.observation : "-"}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.justified ? (
                        <button
                        className='bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-green-300 border-b-2 border-green-700 hover:border-green-500 rounded'
                          onClick={() => handleJustifyAbsence(item.id , props.stagiaireId)} 
                          title="Cliquez pour Annuler la Justification de cette Absence">
                          <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: '#FFFFFF' }} />
                        </button>
                      ) : (
                        <button 
                        className='bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-red-300 border-b-2 border-red-700 hover:border-red-500 rounded'
                        onClick={() => handleJustifyAbsence(item.id, props.stagiaireId)} 
                        title="Cliquez pour Justifier cette Absence.">
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
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};


