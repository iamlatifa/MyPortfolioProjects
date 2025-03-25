import React, { useState, useEffect } from "react";
import { GetGroupes, PostStagiaires } from '../../interceptors/api';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function AddStudentModal(props) {
  const year = localStorage.getItem('year');
  const [groupe, setGroupe] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data2 = await GetGroupes(year);
        setGroupe(data2);
        setIsLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    PostStagiaires(e.target, year)
      .then((result) => {
        toast.success(result);
        props.setUpdated(true);
      },
        (error) => {
          toast.error("Server erreur");

        })
  }
  return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered >
        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Ajouter un etudiant
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="Matricule">
              <Form.Label>Matricule</Form.Label>
              <Form.Control type="text" name="id" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="LastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="FirstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="prenom" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="Cin">
              <Form.Label>Cin</Form.Label>
              <Form.Control type="text" name="cin" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="Tel">
              <Form.Label>Numero de teleTel :</Form.Label>
              <Form.Control type="text" name="tel" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="filiere">
              <Form.Label>Code de la filiere</Form.Label>
              <Form.Control type="text" name="code" required placeholder="" />
            </Form.Group>

            <Form.Group controlId="groupe">
              <Form.Label>Code de groupe</Form.Label>
              <Form.Control>
                <Form.Select name="groupe">
                  {groupe.map(item => {
                    return (
                      <option key={item.id}>{item.nom}</option>)
                  })}
                </Form.Select>
              </Form.Control>
            </Form.Group>
            <Form.Group className="float-right my-2">
                <Button variant="success" type="submit" className="px-5">
                  Ajouter
                </Button>
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
      </Modal>



  );
};

