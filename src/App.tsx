import { BrowserRouter, Routes, Route } from "react-router"
import HomeView from "./views/HomeView"
import AuthLayout from "./layouts/AuthLayout"
import RegisterView from "./views/RegisterView"
import LoginView from "./views/LoginView"
import DetailUser from "./views/DetailUser"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
        </Route>
        <Route path="/user/:id" element={<DetailUser />} />
      </Routes>
    </BrowserRouter>
  )


}

export default App
