import { fetch } from 'bun';
import env from './env.ts';

/**
 * A simple client for the Advent of Code API.
 * @param path - The path to the resource to fetch.
 * @returns The response from the API.
 */
export const aocClient = async (path: string) => {
  const res = await fetch(`https://adventofcode.com/${path}`, {
    headers: {
      // Always set our auth cookie
      Cookie: `session=${env.aocSessionCookie}`,
      // Always set our user agent so we can be identified if we accidentally spam the servers.
      'User-Agent': 'some scripts by jansmitch@gmail.com (private repo)',
    },
  });
  return res;
};
