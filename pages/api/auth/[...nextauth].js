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
}

export default NextAuth(authOptions)