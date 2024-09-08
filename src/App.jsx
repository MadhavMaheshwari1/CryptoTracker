import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Dashboard from './Pages/Dashboard';
import ComparePage from './Pages/ComparePage';
import WishListPage from './Pages/WishListPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/Compare' element={<ComparePage />}></Route>
          <Route path='/WishList' element={<WishListPage />}></Route>
          <Route path='/Dashboard' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
