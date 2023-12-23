import { extractStackTraceInfo } from "../utils";
const dashboardIdProvided = async (req, res, next) => {
  const id = req?.params?.dashboardId;
  const parsedId = parseInt(id);

  if (!id || isNaN(parsedId) || parsedId.toString() !== id) {
    return res.status(400).json({
      location: extractStackTraceInfo(new Error()),
      message: "Provide a valid ID",
    });
  }

  req.dashboardId = parsedId;
  next();
};
export { dashboardIdProvided };
