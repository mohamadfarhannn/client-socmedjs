import { useState } from "react"
import Hero from "@assets/image/socmed-img.webp"
import Logo from "@assets/image/logo.webp"
import { Link, useNavigate } from "react-router"
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { AxiosError } from "axios";


const LoginView = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({})

  const loginMutation = useMutation({
    mutationFn: async (dataToSubmit: { email?: string; username?: string; password?: string }) => {
      const res = await api.post("/auth/login", dataToSubmit);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      alert("Login Berhasil!");
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Terjadi kesalahan koneksi ke server";
      
      // Petakan error response dari backend Express ke input error UI
      if (error.response?.status === 404) {
        setErrors({ identifier: message });
      } else if (error.response?.status === 401) {
        setErrors({ password: message });
      } else {
        alert(message);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { identifier?: string; password?: string } = {}

    // Validasi "wajib diisi"
    if (!identifier.trim()) {
      newErrors.identifier = "Email atau username wajib diisi"
    }

    if (!password.trim()) {
      newErrors.password = "Password wajib diisi"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      loginMutation.mutate({
        email: identifier,
        username: identifier,
        password: password
      });
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
          {/* Login */}
          <div className="card flex w-full">
            <div className="card-body px-8 py-10 flex w-full">
              <div className="text-left">
                <h1 className="text-xl font-semibold">Sign in</h1>
                <p className="text-3xl font-bold">Welcome Back!</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Email or Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Input email or username"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }))
                    }}
                    className={`input input-bordered w-full bg-base-200 mt-2 ${errors.identifier ? "input-error" : ""}`}
                  />
                  {errors.identifier && (
                    <div className="label pb-0">
                      <span className="label-text-alt text-error font-medium">{errors.identifier}</span>
                    </div>
                  )}
                </div>

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

                <div className="text-right mt-2">
                  <Link to="/forgot-password" className="text-xs link link-hover link-primary font-semibold">Forgot password?</Link>
                </div>
                <button type="submit" className="btn btn-primary text-white w-full mt-4" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
                </button>
              </form>

               <div className="divider">OR</div>
              
              <button onClick={() => loginGoogle()} type="button" className="btn btn-outline w-full flex items-center justify-center gap-2">
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>
              
              {/* Register */}
              <div className="card bg-base-100 mt-3">
                <div className="card-body py-4 text-center text-sm flex flex-row items-center justify-center gap-1">
                  Don't have an account?<Link to="/register" className="link link-primary font-semibold cursor-pointer">Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView