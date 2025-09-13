import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Steam Custom",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                code: { label: "2FA Code", type: "text", optional: true }
            },
            async authorize(credentials, req) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // Call your backend Express API
                const res = await fetch("http://localhost:4000/steam/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                });

                const data = await res.json();

                if (data.require2FA) {
                    // Tell frontend to show 2FA input
                    throw new Error(`2FA_REQUIRED:${data.domain}`);
                }

                if (!data.success) {
                    throw new Error(data.error || "Login failed");
                }

                return {
                    id: data.steamID,
                    name: credentials.username,
                };
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt" as const,
    },

    callbacks: {
        
        async jwt({ token, user }: {token: any, user: any}) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }: {session: any, token: any}) {
            if (token?.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
