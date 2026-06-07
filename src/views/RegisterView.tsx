import { useState } from "react"
import Hero from "@assets/image/socmed-img-2.webp"
import Logo from "@assets/image/logo.webp"
import { Link, useNavigate } from "react-router"
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { AxiosError } from "axios";

const RegisterView = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ fullname?: string; email?: string; username?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { fullname?: string; email?: string; username?: string; password?: string } = {}

    // Validasi Full Name
    if (!fullname.trim()) {
      newErrors.fullname = "Full name wajib diisi"
    }

    // Validasi Email
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid"
    }

    // Validasi Username
    if (!username.trim()) {
      newErrors.username = "Username wajib diisi"
    } else if (username.trim().length < 3) {
      newErrors.username = "Username minimal 3 karakter"
    }

    // Validasi Password
    if (!password.trim()) {
      newErrors.password = "Password wajib diisi"
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert("Registrasi Berhasil!")
    }
  }

  const googleMutation = useMutation({
    mutationFn: async (googleToken: string) => {
      const res = await api.post("/auth/google", { googleToken });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      alert("Login Google Berhasil!");
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Otorisasi Google gagal";
      alert(message);
    }
  });

   // Google Auth Menggunakan custom hook agar tampilan responsive 100% dan bebas distyling
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleMutation.mutate(tokenResponse.access_token);
    },
    onError: () => console.log('Proses Login Google Gagal'),
  });

  return (
    <div className="flex flex-col xl:flex-row w-full max-w-5xl items-center xl:justify-between gap-5 xl:gap-20 pt-10">
      {/* logo and tagline for mobile/tablet */}
      <div className="flex flex-col items-center gap-0 xl:hidden">
        <img src={Logo} alt="Logo" className="w-55 md:w-60 " />
        <p className="text-md sm:text-xl text-[#D97757] font-bold text-center px-4">Share your life, connect with the world!</p>
      </div>

      {/* left content */}
      <div className="hidden xl:flex xl:items-center xl:justify-center xl:flex-col justify-start">
        <div className="w-full max-w-sm flex flex-col items-center gap-0">
          <img src={Logo} alt="Logo" className="w-60" />
          <p className="text-xl text-[#D97757] font-bold">Share your life, connect with the world!</p>
        </div>
        <img src={Hero} alt="Hero" className="w-115 mt-1" />
      </div>

      {/* right content */}
      <div className="flex flex-1 flex-col items-center justify-center bg-base-100 rounded-4xl max-w-md w-[calc(100%-2rem)] sm:w-full mx-4 lg:mx-0">
        <div className="w-full max-w-md ">
          {/* Register */}
          <div className="card flex w-full">
            <div className="card-body px-8 py-10 flex w-full">
              <div className="text-left">
                <h1 className="text-xl font-semibold">Sign up</h1>
                <p className="text-3xl font-bold">Create Account</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                {/* Full Name */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input full name"
                    value={fullname}
                    onChange={(e) => {
                      setFullname(e.target.value)
                      if (errors.fullname) setErrors((prev) => ({ ...prev, fullname: undefined }))
                    }}
                    className={`input input-bordered w-full bg-base-200 mt-2 ${errors.fullname ? "input-error" : ""}`}
                  />
                  {errors.fullname && (
                    <div className="label pb-0">
                      <span className="label-text-alt text-error font-medium">{errors.fullname}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Input email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    className={`input input-bordered w-full bg-base-200 mt-2 ${errors.email ? "input-error" : ""}`}
                  />
                  {errors.email && (
                    <div className="label pb-0">
                      <span className="label-text-alt text-error font-medium">{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }))
                    }}
                    className={`input input-bordered w-full bg-base-200 mt-2 ${errors.username ? "input-error" : ""}`}
                  />
                  {errors.username && (
                    <div className="label pb-0">
                      <span className="label-text-alt text-error font-medium">{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Input password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    className={`input input-bordered w-full bg-base-200 mt-2 ${errors.password ? "input-error" : ""}`}
                  />
                  {errors.password && (
                    <div className="label pb-0">
                      <span className="label-text-alt text-error font-medium">{errors.password}</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary text-white w-full mt-6">Sign up</button>
              </form>

              <div className="divider">OR</div>

              <button onClick={() => loginGoogle()} type="button" className="btn btn-outline w-full flex items-center justify-center gap-2">
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>
              
              {/* Redirect to Login */}
              <div className="card bg-base-100 mt-3">
                <div className="card-body py-4 text-center text-sm flex flex-row items-center justify-center gap-1">
                  Already have an account?<Link to="/login" className="link link-primary font-semibold cursor-pointer">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterView