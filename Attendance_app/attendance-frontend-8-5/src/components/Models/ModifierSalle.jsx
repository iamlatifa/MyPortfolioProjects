import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import { GetSalleById, PutSalles ,GetAnnee} from '../../interceptors/api';
import { toast } from 'react-toastify';

export default function UpdateSalleModal(props) {
  const [editsalle, setEditsalle] = useState(null);
  const [nom, setNom] = useState('');
  const [type, setType] = useState('');
  const [years, setYears] = useState('');
  const oldyear = localStorage.getItem('year');
  const [annee, setAnnee] = useState(oldyear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetSalleById(props.id);
        const data2 = await GetAnnee();
        setYears(data2)
        setEditsalle(data[0]);
        setNom(data[0].nom || '');
        setType(data[0].type || '');
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

    PutSalles(props.id, {
      nom,
      type,
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
    <Modal {...props} size="lg" centered>
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Modifier Salle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editsalle && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Titulier</Form.Label>
              <Form.Control value={nom} type="text" onChange={(e) => setNom(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Département</Form.Label>
              <Form.Control value={type} type="text" onChange={(e) => setType(e.target.value)} required />
            </Form.Group>
            <Form.Label> Annee Scolaire</Form.Label>
            <Form.Control as="select" value={annee} onChange={(e) => setAnnee(e.target.value)} required>
              {years.map((item) => (
                <option key={item.id} value={item.id}>{item.annee}</option>
              ))}
            </Form.Control>
            <Form.Group>
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
  );
}
