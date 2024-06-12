import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getReportData } from '../../services/api';

const Report = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    getReportData()
      .then(response => {
        // Normalize the rating value for better visualization
        const normalizedData = response.data.map(item => ({
          ...item,
          normalized_rating: item.rating * 10000000, // Adjust the multiplier as needed
          normalized_years_of_experience: item.years_of_experience * 1000000
        }));
        setReportData(normalizedData);
      })
      .catch(error => {
        console.error('Error fetching report data:', error);
      });
  }, []);

  return (
    <div className="report-container">
      <h2>Company Report</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <XAxis dataKey="contact_name" stroke="#ffffff" />
          <YAxis stroke="#ffffff"/>
          <Tooltip />
          <Legend />
          <Bar dataKey="average_price" fill="#8884d8" />
          <Bar dataKey="normalized_rating" fill="#82ca9d" name="Rating" />
          <Bar dataKey="normalized_years_of_experience" fill="#ffc658" name="Years of Experience" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Report;
