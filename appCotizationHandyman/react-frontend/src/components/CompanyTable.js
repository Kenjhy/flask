import React, { useEffect, useState, useMemo } from 'react';
import AddCompanyModal from './modals/AddCompanyModal';
import EditCompanyModal from './modals/EditCompanyModal';
import DetailModal from './modals/DetailModal'; // Import the new DetailModal component
import { getCompanies, deleteCompany } from '../services/api';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { FaInfoCircle } from 'react-icons/fa'; // Import the icon from react-icons
import { matchSorter } from 'match-sorter';


const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);

    // Fetch companies from the backend
    const fetchCompanies = () => {
        getCompanies()
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
            deleteCompany(id)
                .then(() => {
                    setCompanies(companies.filter(company => company.id !== id));
                    fetchCompanies(); //Refresh the list after deleting
                })
                .catch(error => console.error('Error deleting company:', error));
        }
    };

    const handleDetail = (company) => {
        setCurrentCompany(company);
        setShowDetailModal(true);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Table Rows
    const data = useMemo(() => companies, [companies]);

    const columns = useMemo(() => [
        {
            Header: 'Image',
            accessor: 'image_path',
            Cell: ({ cell: { value } }) => (
                <img src={`${value}?${new Date().getTime()}`} alt="Company" style={{ width: '80px', height: '40px' }} />
            ),
            className: 'col-medium'
        },
        { Header: 'Company Name', accessor: 'company_name', className: 'col-large' },
        { Header: 'Contact Name', accessor: 'contact_name', className: 'col-large' },
        { Header: 'Phone', accessor: 'phone', className: 'col-medium' },
        { Header: 'Skills', accessor: 'skills', className: 'col-medium' },
        { Header: 'Date of Contact', accessor: 'date_of_contact', className: 'col-medium' },
        { Header: 'Date Start Works', accessor: 'date_start_works', className: 'col-medium' },
        { Header: 'Working Time', accessor: 'working_time', className: 'col-medium' },
        { Header: 'Meeting', accessor: 'meeting', className: 'col-medium' },
        { Header: 'Average Price', accessor: 'average_price', className: 'col-medium', Cell: ({ cell: { value } }) => formatCurrency(value) },
        { Header: 'Final Price', accessor: 'final_price', className: 'col-medium', Cell: ({ cell: { value } }) => formatCurrency(value) },
        { Header: 'Workplace', accessor: 'workplace', className: 'col-large' },
        { Header: 'Methods of Payment', accessor: 'methods_of_payment', className: 'col-medium' },
        { Header: 'Work Method', accessor: 'work_method', className: 'col-medium' },
        { Header: 'Quote', accessor: 'quote', className: 'col-small' },
        { Header: 'State', accessor: 'state.name', className: 'col-medium', Cell: ({ cell: { value } }) => value || 'N/A' },
        { Header: 'Online View', accessor: 'online_view', className: 'col-small' },
        { Header: 'On-Site View', accessor: 'on_site_view', className: 'col-medium' },
        { Header: 'Rating', accessor: 'rating.classification', className: 'col-small', Cell: ({ cell: { value } }) => value || 'N/A' },
        {
            Header: 'Link',
            accessor: 'link',
            className: 'col-small',
            Cell: ({ cell: { value } }) => (
                <a href={value} target="_blank" rel="noopener noreferrer">Link</a>
            )
        },
        {
            Header: 'Details',
            accessor: 'details',
            className: 'col-small',
            Cell: ({ row }) => (
                <FaInfoCircle onClick={() => handleDetail(row.original)} style={{ cursor: 'pointer' }} />
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            className: 'col-large',
            Cell: ({ cell: { value } }) => (
                <>
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(companies.find(c => c.id === value))}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(value)}>Delete</button>
                </>
            )
        }
    ], [companies]);

    const filterTypes = useMemo(() => ({
        fuzzyText: (rows, id, filterValue) => {
            return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
        },
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id];
                return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
            });
        }
    }), []);

    const defaultColumn = useMemo(() => ({
        Filter: DefaultColumnFilter
    }), []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data,
        defaultColumn,
        filterTypes
    }, useGlobalFilter, useSortBy);

    const { globalFilter } = state;

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length;

        return (
            <input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Search ${count} records...`}
            />
        );
    }

    return (
        <>
            <h2>Company Management</h2>
            <div className="fixed-button-container">
                <button onClick={() => setShowModal(true)} className="btn btn-success">Add New Company</button>
                <input
                    value={globalFilter || ""}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    style={{ marginLeft: '10px', padding: '5px' }}
                />
            </div>
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
            {showDetailModal && currentCompany && (
                <DetailModal
                    show={showDetailModal}
                    handleClose={() => setShowDetailModal(false)}
                    companyData={currentCompany}
                />
            )}
            <div className="table-responsive">
                <table {...getTableProps()} className="table table-hover table-striped table-bordered custom-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead className="table-dark">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className={column.className}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CompanyTable;