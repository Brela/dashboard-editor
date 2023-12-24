const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token.replace(/\"/g, ""),
      process.env.TOKEN_SECRET,
    );
    return { status: true, data: decoded };
    // # TODO: Handle if token is expired
  } catch (e) {
    // console.log("Error", e)
    return { status: false };
  }
};

const validateUser = async (req, res, next) => {
  token = req.cookies.authToken;
  if (!token) {
    return res.status(403).json({ message: "Invalid session" });
  }
  const decodedToken = verifyToken(token);
  if (!decodedToken.status) {
    return res
      .status(decodedToken.code)
      .json({ message: decodedToken.message });
  }
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.data.id || decodedToken.data.userId },
  });

  if (!user) {
    return res
      .status(404)
      .json({ message: "Invalid session. Please log in again" });
  }
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  next();
};

export { validateUser };
