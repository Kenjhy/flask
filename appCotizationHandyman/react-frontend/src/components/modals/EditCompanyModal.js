import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateCompany, getStates  } from '../../services/api';


const EditCompanyModal = ({ show, handleClose, companyData, refreshCompanies, updateCompanies  }) => {
    const [formData, setFormData] = useState({ ...companyData });
    const [states, setStates] = useState([]);

    useEffect(() => {
        if (show) {
            getStates().then(response => {
                setStates(response.data);
                // Make sure that formData is updated only if companyData has changed.
                if (companyData) {
                    setFormData({ ...companyData }); // Update form data when companyData changes // This ensures the form updates when the selected company changes.
                }
            });
        }
    }, [show, companyData]); // Dependencia añadida para companyData

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prevState => ({
                ...prevState,
                image_base64: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        updateCompany(companyData.id, {
            ...formData,
            image_base64: formData.image_base64 // Ensure image_base64 is sent
        })
        .then(response => {
            if (response.status === 200 || response.status === 201) { 
                updateCompanies({...companyData, ...formData}); // Call updateCompanies with the updated data
                refreshCompanies();  // Optional, if you want to make sure that you data is synchronized
                handleClose();
            }
        }).catch(error => console.error('Error updating company:', error));
        
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Company</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {[
                        { label: 'Image:', name: 'image', type: 'file', changeHandler: handleImageChange },
                        { label: 'Company Name:', name: 'company_name', type: 'text', required: true },
                        { label: 'Contact Name:', name: 'contact_name', type: 'text' },
                        { label: 'Phone:', name: 'phone', type: 'text' },
                        { label: 'Skills:', name: 'skills', type: 'text' },
                        { label: 'Date of Contact:', name: 'date_of_contact', type: 'date' },
                        { label: 'Date Start Works:', name: 'date_start_works', type: 'date' },
                        { label: 'Working Time:', name: 'working_time', type: 'number' },
                        { label: 'Meeting:', name: 'meeting', type: 'date' },
                        { label: 'Hour Met:', name: 'hour_meet', type: 'text' },
                        { label: 'Average Price:', name: 'average_price', type: 'number' },
                        { label: 'Final Price:', name: 'final_price', type: 'number' },
                        { label: 'Workplace:', name: 'workplace', type: 'text' },
                        { label: 'Methods of Payment:', name: 'methods_of_payment', type: 'text' },
                        { label: 'Work Method:', name: 'work_method', type: 'text' },
                        { label: 'Quote:', name: 'quote', type: 'text' },
                        { label: 'Online View:', name: 'online_view', type: 'text' },
                        { label: 'On Site View:', name: 'on_site_view', type: 'text' },
                        { label: 'Calification:', name: 'calification', type: 'number' },
                        { label: 'Link:', name: 'link', type: 'url' },
                        { label: 'Details:', name: 'details', type: 'textarea' }
                    ].map(field => (
                        <Form.Group key={field.name} className="custom-form-group">
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type={field.type}
                                name={field.name}
                                required={field.required || false}
                                onChange={field.changeHandler || handleInputChange}
                                value={field.type === 'file' ? undefined : (formData[field.name] || '')}
                                as={field.type === 'textarea' ? 'textarea' : 'input'}
                                rows={field.type === 'textarea' ? 3 : undefined}
                            />
                        </Form.Group>
                    ))}
                    <Form.Group className="custom-form-group">
                        <Form.Label>State</Form.Label>
                        <Form.Control as="select" name="state_id" value={formData.state_id || ''} onChange={handleInputChange}>
                            <option value="">Select a State</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update Company
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCompanyModal;
