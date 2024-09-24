'use client';
import { SessionProvider } from 'next-auth/react';
// This isn't really needed, but the default export from next-auth doesn't include 'use client', so it fails

export default SessionProvider;
