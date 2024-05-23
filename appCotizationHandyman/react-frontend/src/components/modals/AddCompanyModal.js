import React, { useState, useEffect  } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addCompany, getStates, getRatings  } from '../../services/api';


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
        average_price: '',
        final_price: '',
        workplace: '',
        methods_of_payment: '',
        work_method: '',
        quote: '',
        state_id: '',
        online_view: '',
        on_site_view: '',
        rating_id: '',
        link: '',
        details: ''
    });

    const [states, setStates] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        if (show) {
            getStates().then(response => {
                setStates(response.data);
                setFormData(formData => ({ ...formData, state_id: '' }));  // Set state_id to empty for default non-selection
            });
            getRatings().then(response => {
                setRatings(response.data);
                setFormData(formData => ({ ...formData, rating_id: '' }));
            });
        }
    }, [show]);  // Dependency on show to reload states when modal opens
    
    const formatCurrency = (value) => {
        const numberValue = parseInt(value.replace(/[^0-9]/g, ''));
        if (isNaN(numberValue)) return '';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(numberValue);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        if (name === 'average_price' || name === 'final_price') {
            formattedValue = formatCurrency(value);
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: formattedValue
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
                average_price: formData.average_price.replace(/[^0-9]/g, ''),
                final_price: formData.final_price.replace(/[^0-9]/g, ''),
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
                        { label: 'Average Price:', name: 'average_price', type: 'text' },
                        { label: 'Final Price:', name: 'final_price', type: 'text' },
                        { label: 'Workplace:', name: 'workplace', type: 'text' },
                        { label: 'Methods of Payment:', name: 'methods_of_payment', type: 'text' },
                        { label: 'Work Method:', name: 'work_method', type: 'text' },
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
                                value={field.type === 'file' ? undefined : formData[field.name]} // Ensure value is not set for file input
                            />
                        </div>
                    ))}
                    <Form.Group className="custom-form-group">
                        <Form.Label>Quote</Form.Label>
                        <Form.Control as="select" name="quote" value={formData.quote} onChange={handleInputChange}>
                            <option value="">Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="custom-form-group">
                        <Form.Label>Online View</Form.Label>
                        <Form.Control as="select" name="online_view" value={formData.online_view} onChange={handleInputChange}>
                            <option value="">Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="custom-form-group">
                        <Form.Label>On Site View</Form.Label>
                        <Form.Control as="select" name="on_site_view" value={formData.on_site_view} onChange={handleInputChange}>
                            <option value="">Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="custom-form-group">
                        <Form.Label>State</Form.Label>
                        <Form.Control as="select" name="state_id" value={formData.state_id} onChange={handleInputChange}>
                            <option value="">Select a State</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="custom-form-group">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control as="select" name="rating_id" value={formData.rating_id} onChange={handleInputChange}>
                            <option value="">Select a Rating</option>
                            {ratings.map(rating => (
                                <option key={rating.id} value={rating.id}>{rating.classification}</option>
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
