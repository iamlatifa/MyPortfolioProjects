import React, { useState, useEffect } from "react";
import { GetGroupes, PutStagiaires, GetStagiaireById, GetAnnee } from '../../interceptors/api';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function UpdateStudentModal(props) {
  const [editstagiaire, setEditStagiaire] = useState({});
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [cin, setCin] = useState('');
  const [tel, setTel] = useState('');
  const [codeFiliere, setCodeFiliere] = useState('');
  const [codeGroupe, setCodeGroupe] = useState('');
  const [years, setYears] = useState([]);
  const [groupes, setGroupes] = useState([]); // Renamed to avoid conflicts
  const oldYear = localStorage.getItem('year');
  const [annee, setAnnee] = useState(oldYear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetStagiaireById(props.id);
        const data2 = await GetAnnee();
        const data3 = await GetGroupes(oldYear); // Fetch based on oldYear
        console.log(data[0])
        setGroupes(data3); // Updated to setGroupes
        setYears(data2);
        setEditStagiaire(data[0]);
        setNom(data[0].nom || '');
        setPrenom(data[0].prenom || '');
        setCin(data[0].cin || '');
        setEmail(data[0].email || '');
        //setCodeFiliere(data[0].cf || '');
        setCodeGroupe(data[0].groupe || ''); // Corrected the variable name
        setTel(data[0].tel || '');

      } catch (error) {
        console.log('Error:', error);
      }
    };
    if (props.show) {
      fetchData();
    }
  }, [props.id, oldYear]); // Added oldYear as a dependency

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(codeGroupe)
    PutStagiaires(props.id, {
      nom,
      prenom,
      email,
      cin,
      //codeFiliere,
      codeGroupe,
      tel,
      annee,
    })
      .then((result) => {
        toast.success(result);
        props.refresh();
        props.onHide();
        setAnnee(oldYear);
      })
      .catch((error) => {
        toast.error("Server error");
      });
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Modifier stagiaire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editstagiaire && (
          <Form onSubmit={handleSubmit}>
           <Form.Group controlId="LastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control value={nom} type="text" onChange={(e) => setNom(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="FirstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control value={prenom} type="text" onChange={(e) => setPrenom(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="Cin">
              <Form.Label>Cin</Form.Label>
              <Form.Control value={cin} type="text" onChange={(e) => setCin(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="Tel">
              <Form.Label>Numero de téléphone</Form.Label>
              <Form.Control value={tel} type="text" onChange={(e) => setTel(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} type="text" onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            {/* <Form.Group controlId="filiere">
              <Form.Label>Code de la filiere</Form.Label>
              <Form.Control as="select" value={codeFiliere} onChange={(e) => setCodeGroupe(e.target.value)} required>
                {filieres.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nom}
                  </option>
                ))}
                 </Form.Control>
            </Form.Group> */}
            <Form.Group controlId="groupe">
              <Form.Label>Code de groupe</Form.Label>
              <Form.Control as="select" value={codeGroupe} onChange={(e) => setCodeGroupe(e.target.value)} required>
                {groupes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nom}
                  </option>
                ))}
                 </Form.Control>
            </Form.Group>
            <Form.Group controlId="annee">
              <Form.Label>Année</Form.Label>
              <Form.Control as="select" value={annee} onChange={(e) => setAnnee(e.target.value)} required>
                {years.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.annee}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Modal.Footer>
                        <Button className='bg-blue-500 px-5' type="submit" >
                          Modifier
                        </Button>
                        </Modal.Footer>
                    </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="" onClick={props.onHide}>
          Fermer
        </button>
      </Modal.Footer>
    </Modal>
  );
}
