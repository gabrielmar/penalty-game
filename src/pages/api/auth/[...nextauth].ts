import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = { id: '1' };

        const admin = { username: 'admin', password: 'passwd' };
        if (credentials?.username === admin.username && credentials?.password === admin.password)
          return user;

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
