import { RequestEvent, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getPatientById } from "../../../api/services/user";

export const load:PageServerLoad = async (event: RequestEvent) => {
    let response;
    // try {
        const patientUserId = event.params.id;
        const sessionId = event.locals.sessionUser.sessionId;
        console.log(patientUserId, sessionId);
        if (!sessionId || !patientUserId) {
            throw error(400, "Invalid session");
        }
        response = await getPatientById(sessionId, patientUserId);
        console.log('@@@', response);
    // } catch(error) {

    // }
const user = {
    DisplayName: response.Patient.User.Person.DisplayName,
    FirstName: response.Patient.User.Person.FirstName,
    MiddleName: response.Patient.User.Person.MiddleName,
    LastName: response.Patient.User.Person.LastName,
    Gender: response.Patient.User.Person.Gender,
    BirthDate: response.Patient.User.Person.BirthDate,
    Phone: response.Patient.User.Person.Phone,
    PatientUserId: response.Patient.User.id
};
 
 return {
    event: event.locals.sessionUser,
    user : user
 }
}
