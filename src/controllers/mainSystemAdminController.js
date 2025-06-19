import logger from "../config/logger.js";
import { addNewCompany, getAllAddedCompanies } from "../services/mainSystemAdminService.js";
import { createTenantSchema } from "../validations/systemUsers.js";


//adding a company to access the system
export const createCompany = async (req, res) => {
  try {
    // Validate input using Joi
    const { error, value } = createTenantSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details.map((err) => err.message),
      });
    }
    const result = await addNewCompany(value);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//revoking access of companies
export const revokeAccess = async (req, res) => {

  const { tenantId } = req.params;
  const result = await revokeCompanyAccess(tenantId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
};


export const fetchAllCompanies = async (req,res) =>{
    try {
    const result = await getAllAddedCompanies();
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error(error)
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching tenants",
    });
  }
}