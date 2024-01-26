/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/logout",
        destination: `${process.env.AWS_COGNITO_HOSTED_UI_DOMAIN}/logout?client_id=${process.env.AWS_COGNITO_CLIENT_ID}&logout_uri=${process.env.OAUTH_SIGN_OUT_REDIRECT_URL}&redirect_uri=${process.env.OAUTH_SIGN_IN_REDIRECT_URL}&response_type=code`,
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig
