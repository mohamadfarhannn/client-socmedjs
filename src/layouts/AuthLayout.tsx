import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-base-200">
        <Outlet />
      </main>

      <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10 gap-6">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
        </nav>
        <aside>
          <p>Copyright © {new Date().getFullYear()} - DailyGrind</p>
        </aside>
      </footer>
    </div>
  )
}

export default AuthLayout