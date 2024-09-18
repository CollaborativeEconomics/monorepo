declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_DEFAULT_REGION: string;
      AWS_MEDIA_BUCKET: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string; // this is the line you want
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}