import { createInstructor } from "../services/instructor"

export const registerInstructor = async () =>{
    const instructor = await createInstructor();
}