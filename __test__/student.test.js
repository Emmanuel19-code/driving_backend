import supertest from "supertest";
import app from "../src/app.js";
import * as studentService from "../src/services/student.js"
import { serviceModels } from "../src/models/index.js";


jest.mock("../src/services/student.js")
jest.mock("../src/models/index.js")

describe("Adding Students",()=>{
    const studentData = {
    fullName: "Jane Doe",
    email: "janedoe@example.com",
    gender: "female",
    address: "123 Street",
    phone: "1234567890",
    serviceId: 1,
  };
  const mockService = {
    serviceId: 1,
    fee: 500,
    serviceType: "Math",
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 400 if email already exists", async () => {
    studentService.findStudentByEmail.mockResolvedValue(studentData);

    const response = await supertest(app)
      .post("/api/v1/students/add_student")
      .send(studentData);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("An account is registered with this email");
  });
  it("should return 400 if service is not found", async () => {
    studentService.findStudentByEmail.mockResolvedValue(null);
    serviceModels.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/students/add_student")
      .send(studentData);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Service is not registered");
  });
  it("should return 201 when student is successfully registered", async () => {
    studentService.findStudentByEmail.mockResolvedValue(null);
    serviceModels.findOne = jest.fn().mockResolvedValue(mockService);
    studentService.createStudent.mockResolvedValue({ id: 1 });

    const response = await request(app)
      .post("/api/v1/students/add_student")
      .send(studentData);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe("Student Created");
  });
  it("should return 409 if student creation fails", async () => {
    studentService.findStudentByEmail.mockResolvedValue(null);
    serviceModels.findOne = jest.fn().mockResolvedValue(mockService);
    studentService.createStudent.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/students/add_student")
      .send(studentData);

    expect(response.status).toBe(409);
    expect(response.body.msg).toBe("Student Could not be added");
  });
   it("should return 400 for invalid input", async () => {
    const invalidData = { ...studentData, email: "not-an-email" };

    const response = await request(app)
      .post("/api/v1/students/add_student")
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
})