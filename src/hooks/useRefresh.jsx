import { useContext } from 'react';

import { axiosPrivate } from '../requests/axios';
import useLogout from './useLogout';
import DataContext from '../context/data-context';

export default function useRefresh() {
  const { setUser } = useContext(DataContext);
  const logout = useLogout();

  const refresh = async () => {
    try {
      const res = await axiosPrivate.get('/refresh');
      if (res.status !== 200) throw new Error('Invalid Credentials');

      const { token, username, role, id, email, first_name, last_name } =
        res.data;
      setUser({
        id,
        first_name,
        last_name,
        username,
        email,
        role,
        access_token: token
      });

      return res.data;
    } catch {
      await logout();
    }
  };
  return refresh;
}
