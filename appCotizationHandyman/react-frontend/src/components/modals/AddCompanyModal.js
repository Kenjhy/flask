import React, { useState, useEffect  } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addCompany, getStates } from '../../services/api';
// import '../../styles/ModalStyles.css'; // Adjust path based on new location


const AddCompanyModal = ({ show, handleClose, refreshCompanies }) => {
    const [formData, setFormData] = useState({
        image: '',
        company_name: '',
        contact_name: '',
        phone: '',
        skills: '',
        date_of_contact: '',
        date_start_works: '',
        working_time: '',
        meeting: '',
        hour_meet: '',
        average_price: '',
        final_price: '',
        workplace: '',
        methods_of_payment: '',
        work_method: '',
        quote: '',
        state_id: '',
        online_view: '',
        on_site_view: '',
        calification: '',
        link: '',
        details: ''
    });

    const [states, setStates] = useState([]);

    useEffect(() => {
        if (show) {
            getStates().then(response => {
                setStates(response.data);
                setFormData(formData => ({ ...formData, state_id: '' }));  // Set state_id to empty for default non-selection
            });
        }
    }, [show]);  // Dependency on show to reload states when modal opens


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
                image: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await addCompany({
                ...formData,
                image_base64: formData.image // Send as base64
            });
            if (response.status === 200 || response.status === 201) {
                refreshCompanies();
                handleClose();
            }
            
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add New Company</Modal.Title>
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
                        { label: 'Meeting:', name: 'meeting', type: 'datetime-local' },
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
                        <div className="custom-form-group" key={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type={field.type}
                                name={field.name}
                                required={field.required || false}
                                onChange={field.changeHandler || handleInputChange}
                                as={field.type === 'textarea' ? 'textarea' : 'input'}
                                rows={field.type === 'textarea' ? 3 : undefined}
                            />
                        </div>
                    ))}
                    <Form.Group className="custom-form-group">
                        <Form.Label>State</Form.Label>
                        <Form.Control as="select" name="state_id" value={formData.state_id} onChange={handleInputChange}>
                            <option value="">Select a State</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Company
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCompanyModal;
