"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Shield, ArrowLeft, RefreshCw, Smartphone } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const phone = searchParams.get("phone") || ""
  const mode = searchParams.get("mode") || "login" // login or signup
  const redirectTo = searchParams.get("redirectTo") || "/"

  // Focus on first input on page load
  useEffect(() => {
    const firstInput = document.getElementById("code-0")
    if (firstInput) {
      firstInput.focus()
    }
  }, [])

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting a full code, try to distribute it across inputs
      if (value.length === 6 && /^\d+$/.test(value)) {
        const newCode = [...verificationCode]
        for (let i = 0; i < 6; i++) {
          newCode[i] = value[i]
        }
        setVerificationCode(newCode)

        // Focus on the last input
        const lastInput = document.getElementById(`code-5`)
        if (lastInput) {
          lastInput.focus()
        }
        return
      }

      // Otherwise just take the first character
      value = value.substring(0, 1)
    }

    // Update the code array
    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join("")

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be a server action or API call to verify the code
      // For demo purposes, we'll simulate verification with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo, we'll accept any 6-digit code
      // In a real app, you would validate against a stored code

      if (mode === "signup") {
        // Store user info in localStorage (in a real app, this would be a secure cookie or token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: Math.floor(Math.random() * 1000),
            name: searchParams.get("name") || "New User",
            phone: phone,
            role: searchParams.get("role") || "staff",
          }),
        )

        toast({
          title: "Account created successfully",
          description: "Your phone number has been verified and your account is now active.",
        })
      } else {
        // For login, we'd normally verify the code and then set the session
        // For demo, we'll just set a mock user
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Admin User",
            phone: phone,
            role: "admin",
          }),
        )

        toast({
          title: "Login successful",
          description: "Your identity has been verified.",
        })
      }

      // Redirect to the specified page or dashboard
      router.push(redirectTo)
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The code you entered is invalid or has expired.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendDisabled(true)
    setCountdown(60) // 60 second cooldown

    try {
      // In a real app, this would trigger sending a new SMS code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code sent",
        description: `A new verification code has been sent to ${phone}`,
      })
    } catch (error) {
      toast({
        title: "Failed to send code",
        description: "There was an error sending the verification code. Please try again.",
        variant: "destructive",
      })
      setResendDisabled(false)
      setCountdown(0)
    }
  }

  const goBack = () => {
    router.back()
  }

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (!phone) return ""

    // If it's already formatted or has special characters, return as is
    if (phone.includes(" ") || phone.includes("-")) return phone

    // Simple formatting for demo purposes
    if (phone.startsWith("+")) {
      const countryCode = phone.slice(0, 3)
      const rest = phone.slice(3)
      return `${countryCode} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`
    }

    // Default simple formatting
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-100 p-3">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify your phone</CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1 mt-1">
              <Smartphone className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-900">{formatPhone(phone)}</span>
            </div>
            <span className="block mt-2">Enter the 6-digit code we sent you</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-12 w-12 text-center text-lg font-semibold"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={isLoading || verificationCode.join("").length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button variant="ghost" size="sm" onClick={handleResendCode} disabled={resendDisabled}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {resendDisabled ? `Resend code (${countdown}s)` : "Resend code"}
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>For demo purposes, any 6-digit code will work.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

