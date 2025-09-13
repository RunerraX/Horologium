export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/((?!login|api/auth).*)", // protect everything except login + nextauth API
    ],
}
