import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCompanyModal from './AddCompanyModal';
import EditCompanyModal from './EditCompanyModal';

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);

    // Fetch companies from the backend
    const fetchCompanies = () => {
        axios.get('http://localhost:5000/api/companies')
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => console.error('Error fetching companies:', error));
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Function to update the list of companies
    const updateCompanies = (updatedCompany) => {
        setCompanies(companies.map(comp => comp.id === updatedCompany.id ? { ...comp, ...updatedCompany } : comp));
    };

    // Function to open edit modal with current company data
    const handleEdit = (company) => {
        setCurrentCompany(company);
        setShowEditModal(true);
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            axios.delete(`http://localhost:5000/api/companies/${id}`)
                .then(() => {
                    setCompanies(companies.filter(company => company.id !== id));
                    fetchCompanies(); //Refresh the list after deleting
                })
                .catch(error => console.error('Error deleting company:', error));
        }
    };

    // Table Rows
    const companyRows = companies.map(company => (
        <tr key={company.id}>
            <td><img src={`${company.image_path}?${new Date().getTime()}`} alt="Company" style={{ width: '80px', height: '40px' }} /></td>
            <td>{company.company_name}</td>
            <td>{company.contact_name}</td>
            <td>{company.phone}</td>
            <td>{company.skills}</td>
            <td>{company.date_of_contact}</td>
            <td>{company.date_start_works}</td>
            <td>{company.working_time}</td>
            <td>{company.meeting}</td>
            <td>{company.hour_meet}</td>
            <td>{company.average_price}</td>
            <td>{company.final_price}</td>
            <td>{company.workplace}</td>
            <td>{company.methods_of_payment}</td>
            <td>{company.work_method}</td>
            <td>{company.quote}</td>
            <td>{company.state}</td>
            <td>{company.online_view}</td>
            <td>{company.on_site_view}</td>
            <td>{company.calification}</td>
            <td><a href={company.link} target="_blank" rel="noopener noreferrer">Link</a></td>
            <td>{company.details}</td>
            <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(company)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(company.id)}>Delete</button>
            </td>
        </tr>
    ));

    return (
        <div className="table-responsive">
            <button onClick={() => setShowModal(true)} className="btn btn-success">Add New Company</button>
            {showModal && 
                <AddCompanyModal 
                    show={showModal} 
                    handleClose={() => setShowModal(false)} 
                    refreshCompanies={fetchCompanies} />}
            {showEditModal && currentCompany && (
                <EditCompanyModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    companyData={currentCompany}
                    refreshCompanies={fetchCompanies}
                    updateCompanies={updateCompanies}  // Pass the function as prop
                />
            )}
            <table className="table table-hover table-striped table-bordered custom-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead className="table-dark">
                    <tr>
                        <th className="col-medium">Image</th>
                        <th className="col-large">Company Name</th>
                        <th className="col-large">Contact Name</th>
                        <th className="col-medium">Phone</th>
                        <th className="col-medium">Skills</th>
                        <th className="col-medium">Date of Contact</th>
                        <th className="col-medium">Date Start Works</th>
                        <th className="col-medium">Working Time</th>
                        <th className="col-medium">Meeting</th>
                        <th className="col-small">Hour Met</th>
                        <th className="col-medium">Average Price</th>
                        <th className="col-medium">Final Price</th>
                        <th className="col-large">Workplace</th>
                        <th className="col-medium">Methods of Payment</th>
                        <th className="col-medium">Work Method</th>
                        <th className="col-small">Quote</th>
                        <th className="col-medium">State</th>
                        <th className="col-medium">Online View</th>
                        <th className="col-medium">On-Site View</th>
                        <th className="col-medium">Calification</th>
                        <th className="col-xlarge">Link</th>
                        <th className="col-xlarge">Details</th>
                        <th className="col-large">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companyRows}
                </tbody>
            </table>
        </div>
    );
};


export default CompanyTable;