import { useState, useEffect } from 'react';
import { jwtEncode } from '../../utils/utils';

const ReportingProjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          userToken: UserToken,
          clientToken: ClientToken,
          time: Math.floor(Date.now() / 1000),
          mode: 'normal'
        };

        const jwtToken = jwtEncode(payload, ClientKey);
        const response = await fetch(
          'https://ui.boondmanager.com/api/reporting-projects',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('API Response Projects Reporting:', result);
          setData(result.data);
        } else {
          console.log('Request failed with status ' + response.status);
          setError('Request failed with status ' + response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Reporting Projects</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <h3>Project ID: {item.relationships.dependsOn.data.id}</h3>
            <p><strong>Category:</strong> {item.attributes.scorecard.category}</p>
            <p><strong>Reference:</strong> {item.attributes.scorecard.reference}</p>
            <p><strong>Value:</strong> {item.attributes.value}</p>
            <p><strong>Start Date:</strong> {item.attributes.startDate || 'N/A'}</p>
            <p><strong>End Date:</strong> {item.attributes.endDate || 'N/A'}</p>
            {/* Add more fields as necessary */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingProjects;
