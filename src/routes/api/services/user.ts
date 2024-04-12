import type { LoginModel } from "$lib/types/domain.models";
import { API_CLIENT_INTERNAL_KEY, BACKEND_API_URL } from "$env/static/private";
import { delete_, get_, post_ } from "./common";

export const loginWithOtp = async (otp: string, phone: string, loginRoleId: number = 2) => {
    const model: LoginModel = {
        Phone: `+${phone}`,
        Otp: otp,
        LoginRoleId: loginRoleId ?? 2,
    }
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    const body = JSON.stringify(model);
    const url = BACKEND_API_URL + '/users/login-with-otp';

    console.log(body);
    console.log(url);
    console.log(JSON.stringify(headers, null, 2));

    const res = await fetch(url, {
        method: 'POST',
        body,
        headers
    });
    const response = await res.json();
    return response;
};

export const deletePatient = async (sessionId: string, patientId: string) => {
    const url = BACKEND_API_URL + `/patients/${patientId}`;
    return await delete_(sessionId, url);
}

export const getPatientById = async (sessionId: string, patientId: string) => {
    const url = BACKEND_API_URL + `/patients/${patientId}`;
    return await get_(sessionId, url);
}

export const generateOtp = async (phone: string, purpose: string, loginRoleId?: number) => {
    const url = BACKEND_API_URL + `/users/generate-otp`;
    phone = '+'+phone;
    let body = {
        Phone: phone,
        Purpose: purpose,
        RoleId: loginRoleId ? loginRoleId: 2
    }
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
    });
    const response = await res.json();
    return response;
}
