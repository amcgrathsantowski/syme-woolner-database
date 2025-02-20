import { useEffect, useContext } from 'react';

import { axiosPrivate } from '../requests/axios';
import useRefresh from './useRefresh';
import useLogout from './useLogout';
import DataContext from '../context/data-context';

export default function usePrivateRequest() {
  const { user, setUser } = useContext(DataContext);

  const refresh = useRefresh();

  const logout = useLogout();

  useEffect(() => {
    const reqInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const resInterceptor = axiosPrivate.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const data = await refresh();
            prevRequest.headers.Authorization = `Bearer ${data?.token}`;
            setUser((prev) => ({ ...prev, access_token: data?.token }));
          } catch {
            await logout();
          }
          return axiosPrivate(prevRequest);
        }
        return err;
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(resInterceptor);
      axiosPrivate.interceptors.request.eject(reqInterceptor);
    };
  }, [refresh, user.accessToken]);

  return axiosPrivate;
}
