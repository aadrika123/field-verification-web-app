import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { contextVar } from '../services/contextVar'

const ProtectedRoutes = (props) => {

    const {isLoggedIn} = useContext(contextVar)

    return (localStorage?.getItem('isLoggedIn') == 'true' && localStorage?.getItem('token') != '') ? <Outlet /> : <Navigate to='/' />

}

export default ProtectedRoutes