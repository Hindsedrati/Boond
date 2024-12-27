import { useState, useEffect } from 'react';
import { jwtEncode } from '../../utils/utils';

const ReportingResources = () => {
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
          'https://ui.boondmanager.com/api/reporting-resources',
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken
            }
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('API Response Resources Reporting:', result);
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
      <h2>Reporting Resources</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <h3>{item.attributes.scorecard.category} - {item.attributes.scorecard.reference}</h3>
            <p><strong>Name:</strong> {item.attributes.name || 'N/A'}</p>
            <p><strong>Role:</strong> {item.attributes.role || 'N/A'}</p>
            <p><strong>Availability:</strong> {item.attributes.availability || 'N/A'}</p>
            {/* Add more fields as necessary */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingResources;
