import type { Request, Response, NextFunction } from "express";
import ratelimit from "../config/upstash";

const ratelimiter = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const identifier = req.ip ?? "unknown";

		const result = await ratelimit.limit(identifier);

		const used = result.limit - result.remaining;

		console.log(`IP: ${identifier}`);
		console.log(`Used: ${used}`);
		console.log(`Remaining: ${result.remaining}`);

		if (!result.success) {
			return res.status(429).json({
				message: "Too many requests, please try again later.",
			});
		}

		next();
	} catch (error) {
		console.log("Rate limit error", error);
		next(error);
	}
};

export default ratelimiter;
