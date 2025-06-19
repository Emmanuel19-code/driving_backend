import logger from "../config/logger.js";
import { getTenantContext } from "../config/tenantDb.js";
import { tenantModel } from "../models/index.js";

export const tenantContextMiddleware = async (req, res, next) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ success: false, error: "Missing tenant ID" });
    }
    const tenant = await tenantModel.findOne({ where: { tenantId } });
    if (!tenant) {
      return res.status(404).json({ success: false, error: "Tenant not found" });
    }
    if (tenant.status !== "active") {
      return res.status(403).json({ success: false, error: "Tenant access is revoked" });
    }
    const context = await getTenantContext(tenant);
    req.tenantContext = context;
    next();
  } catch (error) {
    logger.error(error);
    console.error("Tenant context error:", error);

    return res.status(500).json({ success: false, error: "Failed to load tenant context" });
  }
};
