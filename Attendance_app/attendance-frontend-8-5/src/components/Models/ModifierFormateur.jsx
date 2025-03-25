import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { PutFormateurs,GetFormateurById,GetAnnee } from "../../interceptors/api";
import { toast } from 'react-toastify';
export default function UpdateFormateurtModal(props) {
        const [editFormateur, setEditFormateur] = useState(null);
        const [nom, setNom] = useState('');
        const [prenom, setPreNom] = useState('');
        const [email, setEmail] = useState('');
        const [username, setUsername] = useState('');
        const [years, setYears] = useState('');
        const [id, setId] = useState('');
        const oldyear = localStorage.getItem('year');
        const [annee, setAnnee] = useState(oldyear);
        useEffect(() => {
                const fetchData = async () => {
                  try {
                    const data = await GetFormateurById(props.id);
                    const data2 = await GetAnnee();
                    setYears(data2)
                    setEditFormateur(data[0]);
                    setNom(data[0].nom || '');
                    setPreNom(data[0].prenom || '');
                    setEmail(data[0].email || '');
                    setId(data[0].formateurid || '');
                //     setPassword(data[0].password || '');
                    setUsername(data[0].user || '');
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
            
                PutFormateurs(props.id, {
                  nom,
                  prenom,
                //   Password,
                email,
                username,
                  annee,
                })
                  .then((result) => {
                    toast.success(result);
                    props.refresh()
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
                                                Modifiere Formateur
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                {editFormateur && (
                                        <Form onSubmit={handleSubmit}>
                                                <Form.Group controlId="LastName">
                                                        <Form.Label>Nom </Form.Label>
                                                        <Form.Control value={nom} type="text" onChange={(e) => setNom(e.target.value)} required />
                                                </Form.Group>
                                                <Form.Group controlId="FirstName">
                                                        <Form.Label>Prénom </Form.Label>
                                                        <Form.Control value={prenom} type="text" onChange={(e) => setPreNom(e.target.value)} required />
                                                </Form.Group>
                                                <Form.Group controlId="Email">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control value={email} type="text" onChange={(e) => setEmail(e.target.value)} required />
                                                </Form.Group>
                                                <Form.Group controlId="Username">
                                                        <Form.Label>Identifiant</Form.Label>
                                                        <Form.Control value={username} type="text" onChange={(e) => setUsername(e.target.value)} required />
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
                                                <br/>
                                                <Form.Group controlId="Password" className="float-left my-2">
                                                {/* TEMPORARY */}
                                                <a
                                                href={`http://localhost:8000/admin/auth/user/${id}/password`}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button className='bg-red-500 px-5'>
                                                Modifier Mot de passe
                                                </Button>
                                                </a>
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
                </div>
        );
};

