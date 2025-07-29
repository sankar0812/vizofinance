import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../../pages/auth/AuthContext';

export const useCurrentClient = () => {
const { token, user } = useAuth() || {}
  return useQuery({
    queryKey: ['current-client'],
    queryFn: async () => {
      // const res = await axios.get('/api/clients/me', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Cache-Control': 'no-cache',
      //   },
      // });
      // return res.data;
    },
    staleTime: 0,
    cacheTime: 0,
    enabled: !!token, // only fetch if token exists
  });
};

