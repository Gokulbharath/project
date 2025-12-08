const required = (value: string | undefined, name: string) => {
  if (!value) {
    console.warn(`[env] Missing ${name}. Set it in your .env file.`);
  }
  return value ?? '';
};

export const ENV = {
  API_BASE_URL: required(import.meta.env.VITE_API_BASE_URL, 'VITE_API_BASE_URL'),
  SOCKET_URL: required(import.meta.env.VITE_SOCKET_URL, 'VITE_SOCKET_URL'),
};

