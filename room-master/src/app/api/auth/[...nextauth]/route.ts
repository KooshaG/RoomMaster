import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prismaClient';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#004000',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
