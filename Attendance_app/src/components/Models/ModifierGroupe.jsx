import React from "react";
import { useState, useEffect } from 'react';
import { GetFilieres,GetGroupeById,GetAnnee,PutGroupes } from '../../interceptors/api';
import {Modal, Form, Button,} from 'react-bootstrap';
import {toast} from 'react-toastify';

export default function UpdateGroupetModal (props) {
  const year = localStorage.getItem('year');
  const [filieres, setFilieres] = useState([]);
  const [editgroupe, setEditgroupe] = useState(null);
  const [nom, setNom] = useState('');
  const [filiere, setFiliere] = useState('');
  const [years, setYears] = useState([]);
  const oldyear = localStorage.getItem('year');
  const [annee, setAnnee] = useState(oldyear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetGroupeById(props.id);
        const data2 = await GetAnnee();
        const data3 = await GetFilieres(year)
        setFilieres(data3)
        setYears(data2)
        setEditgroupe(data[0]);
        setNom(data[0].nom || '');
        setFiliere(data[0].filiere || '');
      } catch (error) {
        console.log('Error:', error);
      }
    };
    if (props.show) {
      fetchData();
    }
  }, [props.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    PutGroupes(props.id, {
      nom,
      filiere,
      annee,
    })
      .then((result) => {
        toast.success(result);
        props.setUpdated(true);
        props.onHide();
        setAnnee(oldyear)
      })
      .catch((error) => {
        toast.error("Server error");
      });
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
            Modifier Groupe
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
        {editgroupe && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Nom de groupe</Form.Label>
              <Form.Control value={nom} type="text" onChange={(e) => setNom(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="FirstName">
              <Form.Label>Nom de la filière</Form.Label>
              <Form.Control name="filiere" onChange={e=>setFiliere(e.target.value)} as="select" value={filiere}>
                {filieres.map(item => {
                  return (
                    <option value={item.id}>{item.nom}</option>)
                })}
              </Form.Control>
              </Form.Group>
              <Form.Label> Annee Scolaire</Form.Label>
            <Form.Control as="select" value={annee} onChange={(e) => setAnnee(e.target.value)} required>
              {years.map((item) => (
                <option key={item.id} value={item.id}>{item.annee}</option>
              ))}
            </Form.Control>
              <Form.Group className="float-right my-2">
              <Button className='bg-blue-500 px-5' type="submit" >
                  Modifier
                </Button>
              </Form.Group>
          </Form>
        )}
        </Modal.Body>
        <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
      </Modal>
    </div >);
};
