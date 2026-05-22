import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

// Receives an avatar image from the app, uploads it to Cloudinary, and returns its URL.
router.post("/avatar", upload.single("avatar"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "Avatar file is required.",
			});
		}

		const base64Image = req.file.buffer.toString("base64");
		const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

		const result = await cloudinary.uploader.upload(dataUri, {
			folder: "sport-buddy/avatars",
			resource_type: "image",
		});

		return res.status(200).json({
			avatar_url: result.secure_url,
		});
	} catch (error) {
		console.log("Avatar upload error", error);

		return res.status(500).json({
			message: "Could not upload avatar.",
		});
	}
});

export default router;
