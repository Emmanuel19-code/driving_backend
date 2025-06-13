import { instructorModel } from "../models/index.js";


export const findInstructorByEmail = async (email) => {
  return await instructorModel.findOne({ where: { email } });
};

export const createInstructor = async (instructorData) => {
  try {
    const instructor = await instructorModel.create(instructorData);

    if (!instructor) {
      return {
        success: false,
        msg: "Could not add instructor.",
      };
    }
    return {
      success: true,
      msg: "Instructor added successfully.",
      data: instructor,
    };
  } catch (error) {
    return {
      success: false,
      msg: "An error occurred while adding instructor.",
      error: error.message || "Unknown error.",
    };
  }
};


