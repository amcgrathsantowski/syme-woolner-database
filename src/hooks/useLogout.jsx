import { useContext } from 'react';

import { axiosPrivate } from '../requests/axios';
import DataContext from '../context/data-context';

export default function useLogout() {
  const { user, setUser } = useContext(DataContext);

  const logout = async () => {
    try {
      await axiosPrivate.get('/logout');
    } catch {
      // Do nothing
    }
    if (user.access_token && !user.access_token === '') return;

    setUser({
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      role: '',
      access_token: ''
    });
  };

  return logout;
}
