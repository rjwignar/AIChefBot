// @/pages/api/[...nextauth].js
import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
    providers: [
        CognitoProvider({
          clientId: process.env.AWS_COGNITO_CLIENT_ID,
          // our user pool has no client secrets, so pass empty string
          clientSecret: "",
          issuer: process.env.AWS_COGNITO_ISSUER,
          client: {
            token_endpoint_auth_method: "none"
          }
        })
      ],
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            // Called whenever a JWT is created/refreshed.
            if (account?.id) {
                token.id = account.id;
            }
            return token;
        },
        async session(session, token) {
            // Called whenever a session is created/retrieved.
            session.id = token.id;
            return session;
        },
    },
}

export default NextAuth(authOptions)