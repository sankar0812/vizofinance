// pages/ClientPaymentHistory.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Stack, Box } from '@mui/material';
import { formatINR } from '../utils/currency'; // Assuming you have a utility to format currency    


const ClientPaymentHistory = ({ clients }) => {
  const { clientId } = useParams();

  // If clients prop is not provided, use mock data for testing
// Remove defaultClients and fetch client data dynamically
// Example: fetch clients from API or context
// const clientList = clients; // clients should be passed as a prop from parent or fetched via API

  const clientList = clients && clients.length > 0 ? clients : defaultClients;
  const client = clientList.find(c => String(c.id) === String(clientId));

  if (!client) return <Typography>Client not found</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        {client.name} - Full Payment History
      </Typography>
      <Stack spacing={1}>
        {[...client.paymentHistory].reverse().map((p, idx) => (
          <Typography key={idx}>
            {new Date(p.paymentDate).toLocaleDateString()} - {formatINR(p.amountPaid)}{' '}
            {p.principalPaid !== undefined && p.interestPaid !== undefined && (
              <> (Principal: {formatINR(p.principalPaid)}, Interest: {formatINR(p.interestPaid)})</>
            )}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export default ClientPaymentHistory;


// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { Typography, Stack, Box } from '@mui/material';
// import { formatINR } from '../utils/currency';
// import { useClients } from '../utils/ClientsContext';

// const ClientPaymentHistory = () => {
//   const { clientId } = useParams();
//   const { clients } = useClients();

//   const client = clients.find(c => String(c.id) === String(clientId));

//   if (!client) return <Typography>Client not found</Typography>;

//   return (
//     <Box p={2}>
//       <Typography variant="h5" gutterBottom>
//         {client.name} - Full Payment History
//       </Typography>
//       <Stack spacing={1}>
//         {[...client.paymentHistory].reverse().map((p, idx) => (
//           <Typography key={idx}>
//             {new Date(p.paymentDate).toLocaleDateString()} - {formatINR(p.amountPaid)}{' '}
//             {p.principalPaid !== undefined && p.interestPaid !== undefined && (
//               <> (Principal: {formatINR(p.principalPaid)}, Interest: {formatINR(p.interestPaid)})</>
//             )}
//           </Typography>
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default ClientPaymentHistory;
