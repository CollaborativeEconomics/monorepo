import "next";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MAILGUN_API_KEY: string;
      AUTOFUND_ACCOUNT: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      BETTERMINT_ACCOUNT: string;
      BETTERMINT_API_TOKEN: string;
      IRON_SESSION_KEY: string;
      XRPL_WSS_URI: string;
      XUMM_API_KEY: string;
      NEXT_PUBLIC_XUMM_API_KEY: string;
      XUMM_API_SECRET: string;
      CFCE_REGISTRY_API_URL: string;
      CFCE_REGISTRY_API_KEY: string;
      SENTRY_AUTH_TOKEN: string;
    }
  }
}