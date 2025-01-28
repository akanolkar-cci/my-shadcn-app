export interface AuthServiceInterface {
  validateUser(email: string, pass: string): Promise<any>;
  login(user: any);
}
