import { CustomWorld } from './world';
import { LoginPage } from '../pages/login.page';

/**
 * Reusable auth helper
 * - Provides a default username/password (john / demo)
 * - Wraps the existing LoginPage and uses the world's page and parameters
 *
 * Usage (example):
 *   await login(this); // uses john/demo
 *   await login(this, 'alice', 's3cr3t'); // custom credentials
 */
export async function login(world: CustomWorld, username = 'john', password = 'demo'): Promise<void> {
  const loginPage = new LoginPage(world.page);
  // open the baseUrl if provided by world parameters
  if (world.parameters && world.parameters.baseUrl) {
    await loginPage.open(world.parameters.baseUrl);
  }
  await loginPage.login(username, password);
}
