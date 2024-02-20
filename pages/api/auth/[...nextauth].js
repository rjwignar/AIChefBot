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
          },
          authorization: { params: { scope: "openid aws.cognito.signin.user.admin" } },
        })
      ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, user, account, session}){
          // console.log("jwt callback", {token, user, session, account});
          // on sign-in, there is a user
          if (user){
            return {
              ...token,
              id: user.id,
              accessToken: account.access_token,
            }
          }
          return token;
        },
        async session({session, token, user}){
          // console.log("session callback", {session, token, user});
          // pass in user id to session
          return{
            ...session,
            user: {
              ...session.user,
              id: token.id,
              accessToken: token.accessToken,
            }
          };
        },
    },
}

export default NextAuth(authOptions)