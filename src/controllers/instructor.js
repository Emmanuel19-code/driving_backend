import { createInstructor } from "../services/instructor.js"

export const registerInstructor = async () =>{
    const instructor = await createInstructor();
}