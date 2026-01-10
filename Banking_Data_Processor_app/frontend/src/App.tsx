// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import DashboardLayout from "./layout/DashboardLayout";
import UploadFiles from "./pages/UploadFiles";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Typography } from '@mui/material';

function DashboardHome() {
  return <Typography variant="h4">Dashboard</Typography>;
}
function App(){
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>

    <DashboardLayout>

      <Routes>
        <Route path='/' element={<DashboardHome />} />
        <Route path="/upload" element={<UploadFiles />} />
      </Routes>

    </DashboardLayout>
    </BrowserRouter>
  )
  
}

export default App;
