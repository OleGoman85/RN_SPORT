// Shared chat service types and HTTP-friendly domain errors.
export type ChatType = "private" | "event";

// Lets chat services throw errors with the route response status already attached.
export class ChatServiceError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
	}
}
