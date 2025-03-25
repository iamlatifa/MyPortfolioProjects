import React, { useState, useEffect } from "react";
import { Modal, Col, Row, InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { PostFormateurs } from "../../interceptors/api";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faEye ,faEyeSlash} from '@fortawesome/free-solid-svg-icons';

export default function AddFormateurtModal(props) {
    const year = localStorage.getItem('year');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
      };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        PostFormateurs(e.target, year)
            .then((result) => {
                if (result.includes('Nom') || result.includes('Adresse')){
                    toast(result, {
                        icon: '⚠️',
                    });
                }else{
                    toast.success(result)
                    props.refresh()
                    props.onHide()
                }
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
                        Ajouter Formateur
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="LastName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" name="nom" required placeholder="" />
                    </Form.Group>
                    <Form.Group controlId="FirstName">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" name="prenom" required placeholder="" />
                    </Form.Group>
                    <Form.Group controlId="Email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            required
                            placeholder=""
                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                            title="Entrez une adresse email valide."
                        />
                    </Form.Group>
                    <Form.Group controlId="Password">
                        <Form.Label>Mot de passe</Form.Label>
                        <InputGroup>
                        <FormControl
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                            title="Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
                        />
                        <Button variant="outline-secondary" onClick={toggleShowPassword}>
                            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} size="lg" style={{ color: '#6590D5' }} />:<FontAwesomeIcon icon={faEye} size="lg" style={{ color: '#6590D5' }}/>}
                        </Button>

                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="ConfirmPassword">
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <FormControl
                        type="password"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="Username">
                        <Form.Label>Identifiant</Form.Label>
                        <Form.Control type="text" name="username" required placeholder="" />
                    </Form.Group>
                    <Form.Group className="float-right my-2">
                        <Button className="bg-blue-500 px-5" type="submit">
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

