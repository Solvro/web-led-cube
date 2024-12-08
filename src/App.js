import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout'
import MainPage from './MainPage'
import MissingPage from './pages/MissingPage'
import Login from './pages/Login'
import Registration from './pages/Registration'
import RequireAuth from './components/RequireAuth'
import Unauthorized from './pages/Unauthorized'
// it's only temporary of course
const ROLES = {
  'User': 2001,
  'Admin': 1984,
  // just left admin for future reference, it's not needed/used
}

const App = () => {
  

  return (
    <Routes>
    <Route path="/" element={<Layout/>}>
      <Route path="/" element={<MainPage/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Registration/>}/>
      <Route path="unauthorized" element={<Unauthorized/>}/>

      <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
        {/* This is for the future, checks for roles and if the user does not have
        a certain role, they are brought to unauthorized or login
        (will leave only login if there is only one role)*/}
        <Route path="uploadtocube" element={""}/>
      </Route>

      {/* Missing page */}
      <Route path="*" element={<MissingPage/>} />
    </Route>
    </Routes>
  )
}

export default App;
