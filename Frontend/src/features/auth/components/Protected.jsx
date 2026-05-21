import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children, role = "buyer" }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    // Wait for the initial getMe() call to finish before deciding
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'Inter, sans-serif',
                fontSize: 14, color: '#888', background: '#f7f7f5'
            }}>
                Loading...
            </div>
        );
    }

    // Not authenticated → send to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role → send to home, not register
    if (user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default Protected;
