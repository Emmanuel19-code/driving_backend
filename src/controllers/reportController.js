import logger from "../config/logger.js";
import { getSummaryReport } from "../services/reportService.js";

export const getReportsSummary = async (req, res) => {
  try {
    const tenantContext = req.tenantContext;

    if (!tenantContext || !tenantContext.models) {
      return res.status(400).json({
        success: false,
        error: "Tenant context or models missing",
      });
    }

    const result = await getSummaryReport(tenantContext.models);
    return res.json({ success: true, data: result });
  } catch (error) {
    logger.error("Report Summary Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}