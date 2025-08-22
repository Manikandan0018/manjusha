import Favourite from "../models/Favourite.js";

// ✅ Add to favourites
export const addFavourite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Prevent duplicate
    const exists = await Favourite.findOne({ user: userId, product: productId });
    if (exists) return res.status(400).json({ message: "Already in favourites" });

    const fav = await Favourite.create({ user: userId, product: productId });
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all favourites of logged-in user

export const getFavourites = async (req, res) => {
  try {
    const favs = await Favourite.find({ user: req.user._id }).populate("product");
    res.json(favs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Remove from favourites
export const removeFavourite = async (req, res) => {
  try {
    const { productId } = req.params;
    await Favourite.findOneAndDelete({ user: req.user._id, product: productId });
    res.json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
