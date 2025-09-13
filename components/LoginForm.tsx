"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    password: z.string().min(2, { message: "Password must be at least 2 characters." }),
})

const twofaSchema = z.object({
    code: z.string().length(5, { message: "2FA code must be 5 digits." }),
})

export default function LoginForm() {
    const [step, setStep] = useState<"login" | "2fa">("login")
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    })

    const twofaForm = useForm<z.infer<typeof twofaSchema>>({
        resolver: zodResolver(twofaSchema),
        defaultValues: { code: "" },
    })

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setUsername(values.username)
        setPassword(values.password)
        setError("")

        const res = await signIn("credentials", {
            redirect: false,
            username: values.username,
            password: values.password,
        })

        if (res?.error) {
            if (res.error.startsWith("2FA_REQUIRED")) {
                setStep("2fa")
            } else {
                setError(res.error)
            }
        } else {
            window.location.href = "/home"
        }
    }

    async function on2faSubmit(values: z.infer<typeof twofaSchema>) {
        setError("")

        // Verify against Express backend
        const res = await fetch("http://localhost:4000/steam/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: values.code }),
        })

        if (!res.ok) {
            setError("Invalid 2FA code")
            return
        }

        // Retry NextAuth signIn after verifying
        const retry = await signIn("credentials", {
            redirect: false,
            username,
            password,
        })

        if (retry?.error) {
            setError(retry.error)
        } else {
            window.location.href = "/home"
        }
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-96 rounded-2xl border p-6 shadow">
                {step === "login" && (
                    <Form {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={loginForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-red-500">{error}</p>}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </Form>
                )}

                {step === "2fa" && (
                    <Form {...twofaForm}>
                        <form
                            onSubmit={twofaForm.handleSubmit(on2faSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={twofaForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Enter 5-digit code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-red-500">{error}</p>}
                            <Button type="submit" className="w-full">
                                Verify
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    )
}
