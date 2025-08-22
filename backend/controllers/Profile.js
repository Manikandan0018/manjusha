import User from "../models/SignUp.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, shippingAddress } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, shippingAddress },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};
