const isIDProvided = async (req, res, next) => {
  const id = req?.params?.id;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Provide all required params" });
  }
  req.id = parseInt(id);
  next();
};

module.exports = {
  isIDProvided,
};
