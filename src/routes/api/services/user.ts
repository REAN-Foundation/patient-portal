import type { LoginModel } from "$lib/types/domain.models";
import { API_CLIENT_INTERNAL_KEY, BACKEND_API_URL } from "$env/static/private";
import { delete_, get_, post_ } from "./common";
import {
    TEST_USER_START,
    TEST_USER_END
} from '$env/static/private'
export const loginWithOtp = async (otp: string, phone: string, loginRoleId: number = 2) => {
    phone = isTestUser(`+${phone}`);
    console.log("&&&",phone);
    const model: LoginModel = {
        Phone: phone,
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
    phone = isTestUser(phone);
    console.log("&&&",phone);
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

export const logout = async (sessionId: string) => {
	const url = BACKEND_API_URL + `/users/logout`;
	return await post_(sessionId, url, {});
};

const isTestUser = (phone: string) => {
    try {
        const phoneNumber = parseInt(phone.split('-')[1]);
        const start = parseInt(TEST_USER_START);
        const end = parseInt(TEST_USER_END);
        if (phoneNumber >= start && phoneNumber <= end) {
            return phoneNumber.toString();
        } else {
            return phone;
        }

    } catch (error) {
        throw new Error("Invalid phone!")
    }
}
