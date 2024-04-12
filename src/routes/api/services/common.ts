import { SessionManager } from "../session.manager";
import { API_CLIENT_INTERNAL_KEY, BACKEND_API_URL } from "$env/static/private";
import { error } from "@sveltejs/kit";
import chalk from 'chalk';

export const delete_ = async (sessionId: string, url: string) => {
    console.log('Session Is at common ', sessionId);
    const session = await SessionManager.getSession(sessionId);
    console.log('Session', session);
    const accessToken = session ? session.accessToken : null;
    console.log(`accessToken = ${accessToken}`);
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers
    });
    const response = await res.json();
    console.log(response.Message);
    if (response.Status === 'failure' || response.HttpCode !== 200) {
        throw error(response.HttpCode, response.Message);
    }
    return response;
}

export const post_ = async (sessionId: string, url: string, bodyObj: unknown) => {
    const session = await SessionManager.getSession(sessionId);
    const accessToken = session ? session.accessToken : null;

    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    headers['Authorization'] = `Bearer ${accessToken}`;
    const body = JSON.stringify(bodyObj)
    const res = await fetch(url, {
        method: 'POST',
        body,
        headers
    });
    const response = await res.json();
    return response;
}

export const get_ = async (sessionId: string, url: string) => {
    const session = await SessionManager.getSession(sessionId);
    const accessToken = session?.accessToken;
    //console.log(`accessToken = ${accessToken}`);
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(url, {
        method: 'GET',
        headers
    });
    const response = await res.json();
    if (response.Status === 'failure') {
        if (response.HttpCode === 404) {
            console.log(chalk.red(`get_ response message: 404 - ${response.Message}`));
            return null;
        }
        else if(response.HttpCode !== 200) {
            console.log(chalk.red(`get_ response message: ${response.Message}`));
            throw error(response.HttpCode, response.Message);
        }
    }
    console.log(chalk.green(`get_ response message: ${response.Message}`));
    return response.Data;
}
