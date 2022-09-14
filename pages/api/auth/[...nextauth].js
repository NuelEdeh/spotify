import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import SpotifyApi, { LOGIN_URL } from "../../../lib/spotify";

export async function refreshAccessToken(token) {
  try {
    SpotifyApi.setAccessToken(token.accessToken);
    SpotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await SpotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour since 3600 is returned from the Spotify API.
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,

      //  Replace if new one came back else fall back to old refresh token
    };
  } catch (error) {
    console.error(error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // If initial signIn, where we get our first token
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // we are handling expiry time in milliseconds (hence the * 1000 seconds)
        };
      }

      console.log(token.accessTokenExpires);

      // Return the previous token if the access_token is VALID. Here the persistence remains.
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");

        return token;
      }

      // Return the next token if the access_token is EXPIRED. We need to refresh the token.

      console.log("EXISTING ACCESS TOKEN IS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
