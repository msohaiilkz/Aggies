"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff, Plus } from "lucide-react"
import { useLocation } from "wouter"
import { useAuth } from "@/hooks/use-auth"   // ✅ connect with AuthProvider
import dashboard from "../assets/1.png"
import logo from "../assets/3.png"
import bg from "../assets/2.png"

const dummyUsers = [
  { email: "exec@example.com", password: "password123", role: "BUSINESS_HEAD" },
  { email: "analyst@example.com", password: "password123", role: "ANALYST" },
]

export default function AuthPage() {
  const { login } = useAuth()       // ✅ get login function
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "ANALYST",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [error, setError] = useState("")
  const [, setLocation] = useLocation()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginData.email, loginData.password);
    if (success) {
      if (loginData.email.toLowerCase() === "exec@example.com") {
        setLocation("/");
      } else {
        setLocation("/");
      }
    } else {
      setError("Invalid email or password");
    }
  };
  

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy register → user login directly
    login({
      email: registerData.email,
      role: registerData.role as "BUSINESS_HEAD" | "ANALYST",
      username: registerData.username,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
    })
    setLocation("/")
  }
  const handleGoogleSignIn = () => {
    console.log("Google sign in")
  }

  const handleFacebookSignIn = () => {
    console.log("Facebook sign in")
  }
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="flex items-center absolute top-[19px] left-[34px]">
            <img src={logo || "/placeholder.svg"} />
          </div>

          <div className="bg-white rounded-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in Now</h1>
              <p className="text-gray-500">Start your AI teams management now</p>
            </div>

            <Tabs defaultValue="login" className="space-y-4">
              {/* LOGIN */}
              <TabsContent value="login" className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Your Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 px-4 border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0F152D] focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        className="h-12 px-4 pr-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                  >
                    Sign In
                    <Plus size={16} />
                  </Button>
                </div>

                {/* Demo Credentials */}
                {/* <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <p className="text-xs text-gray-600 mb-2"><strong>Demo Credentials:</strong></p>
                  <p className="text-xs text-gray-600">Business Head: exec@example.com / password123</p>
                  <p className="text-xs text-gray-600">Analyst: analyst@example.com / password123</p>
                </div>  */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full h-12 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-gray-700">Signin with Google</span>
                    </button>

                    <button
                      onClick={handleFacebookSignIn}
                      className="w-full h-12 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-gray-700">Signin with Facebook</span>
                    </button>
                  </div>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">Username</Label>
                  <Input
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, username: e.target.value }))}
                    className="h-12 px-4 border-gray-200 rounded-lg"
                  />
                  <Label className="text-gray-700 font-medium">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-12 px-4 border-gray-200 rounded-lg"
                  />
                  <Label className="text-gray-700 font-medium">Password</Label>
                  <Input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                    className="h-12 px-4 border-gray-200 rounded-lg"
                  />

                  <Button
                    onClick={handleRegister}
                    className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                  >
                    Create Account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end p-3">
        <div
          className="rounded-xl p-6 h-full w-full flex items-center justify-center"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img src={dashboard || "/placeholder.svg"} className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </div>
  )
}
