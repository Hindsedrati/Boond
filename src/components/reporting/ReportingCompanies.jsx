import { useState, useEffect } from 'react';
import { jwtEncode } from "../../utils/utils";

const ReportingCompanies = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
          mode: "normal",
        };

        const jwtToken = jwtEncode(payload, ClientKey);
        const response = await fetch(
          'https://ui.boondmanager.com/api/reporting/companies', // Assurez-vous que c'est la bonne URL
          {
            method: 'GET',
            headers: {
              'X-Jwt-Client-Boondmanager': jwtToken,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error(`Failed to fetch data with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Companies Reporting</h2>
      {/* Render your data here */}
    </div>
  );
};

export default ReportingCompanies;
