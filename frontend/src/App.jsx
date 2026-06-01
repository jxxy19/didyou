import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import RoomDetail from './pages/RoomDetail'
import CategoryFeed from './pages/CategoryFeed'
import Upload from './pages/Upload'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import BottomNav from './components/common/BottomNav'

function MainLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/feed/:category" element={<CategoryFeed />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  )
}
