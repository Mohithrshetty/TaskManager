import { useContext, useEffect} from 'react';
import { UserContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (loading) return;
        if(user) return;
    
        if (!user) {
            clearUser();
            // Redirect to login page if user is not authenticated
        navigate('/login');
        } 
    }, [user, loading, navigate]);
    
    return { user, loading, clearUser,navigate };
    }