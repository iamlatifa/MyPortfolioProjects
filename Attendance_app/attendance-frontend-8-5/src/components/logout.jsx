import {useEffect, useState} from "react";
import { BlacklistToken } from '../interceptors/api';
import LoadingSpinner from "./LoadingSpinner";


export const Logout = () => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      BlacklistToken(accessToken,refreshToken).then(() => setLoading(false))
    }, []);
  
    if (loading) {
        return (
            <LoadingSpinner />
          );
        }

    return <></>;
  };