import Token from "../models/Token.js";

export const createToken = async (req, res) => {
  try {
    if (req.body.token) {
      const token = new Token({ token: req.body.token || "default-token" });
      await token.save();
      return res.status(201).json({ success: true });
    }

    const token = new Token({ token: req.body.token || "default-token" });
    await token.save();
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("error creating token", error);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    const verified = await Token.findOne({ token: token });

    if (!verified) {
      return res.status(404).json({ error: "Token not found" });
    }

    res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: verified,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
