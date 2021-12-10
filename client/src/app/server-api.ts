/* global RequestInit, Body */

export const initialDataUrl = () => '/api/initial-data';

export const usersUrl = () => '/api/users';

export const postsUrl = () => '/api/posts';

export const postUrl = (id: string) => `/api/posts/${id}`;

export const postReactionUrl = (id: string) => `/api/posts/${id}/reaction`;

export const notificationsAfterUrl = (sinceTS: string | null | undefined) =>
  `/api/notifications${sinceTS ? `?since=${sinceTS}` : ''}`;

export async function doGet<T>(url: string, requestInit: RequestInit = {}) : Promise<T>
{
  const resp = await fetch(url, requestInit);

  if (!resp.ok) throw Error(`GET request for url ${url} failed with http status ${resp.status}.`);

  return (await resp.json()) as T;
}

export async function doPost<T>(url: string, data: T, reqInit: RequestInit = {}) : Promise<Body>
{
  return fetchWithBody('POST', url, data, reqInit);
}

export async function doPostReturningJson<T>(url: string, data: T, reqInit: RequestInit = {}) : Promise<any>
{
  return (await fetchWithBody('POST', url, data, reqInit)).json();
}

export async function doPut<T>(url: string, data: T, reqInit: RequestInit = {}) : Promise<Body>
{
  return fetchWithBody('PUT', url, data, reqInit);
}

async function fetchWithBody<T>
  (
    method: string,
    url: string,
    data: T,
    reqInit: RequestInit = {}
  )
  : Promise<Body>
{
  const resp = await fetch(url, {
    ...reqInit,
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  if (!resp.ok) throw Error(`${method} request to ${url} failed with http status ${resp.status}.`);

  return resp;
}
