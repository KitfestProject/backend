declare global {
  namespace Express {
    interface Request {
      user: { id: string; email: string; is_admin: boolean; name: string };
    }
  }
}
export {};
