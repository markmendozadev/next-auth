import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectDb } from "../../../lib/db";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  database: process.env.NEXTAUTH_URL,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_MONGO_URI,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;
        const client = await connectDb();
        const db = client.db();

        const user = await db.collection("users").findOne({ email: email });
        if (!user) {
          client.close();
          throw new Error("Email already exists");
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          client.close();
          throw new Error("Could Not Log you in");
        }
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.user_id = user._id;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token.user_id) {
        session.user_id = token.user_id;
      }
      if (token.sub) {
        session.user_id = token.sub;
      }
      return session;
    },
  },
});
