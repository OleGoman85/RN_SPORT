import { sports } from "../data/sports";

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function formatTime(time: string) {
	return time.slice(0, 5);
}

export function formatRating(rating: string | number | null | undefined) {
	const numericRating = Number(rating);

	if (Number.isNaN(numericRating) || numericRating <= 0) {
		return "No rating";
	}

	return numericRating.toFixed(1);
}

export function calculateAge(dateOfBirth: string | null | undefined) {
	if (!dateOfBirth) {
		return null;
	}

	const birthDate = new Date(dateOfBirth);
	const today = new Date();

	if (Number.isNaN(birthDate.getTime())) {
		return null;
	}

	let age = today.getFullYear() - birthDate.getFullYear();

	const hasBirthdayPassed =
		today.getMonth() > birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() &&
			today.getDate() >= birthDate.getDate());

	if (!hasBirthdayPassed) {
		age -= 1;
	}

	return age;
}

export function getNickname(user: {
	nickname: string | null;
	first_name?: string | null;
	last_name?: string | null;
}) {
	if (user.nickname) {
		return `@${user.nickname.replace(/^@/, "")}`;
	}

	const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

	return fullName ? `@${fullName.replace(/\s+/g, "")}` : "@Unknown";
}

export function getFullName(user: {
	first_name?: string | null;
	last_name?: string | null;
	nickname?: string | null;
}) {
	const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

	return fullName || user.nickname || "Unknown user";
}

export function getInitials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

export function getLevelDisplayName(level: string) {
	const normalizedLevel = level.toLowerCase();

	if (normalizedLevel.includes("beginner")) {
		return "Begin";
	}

	if (normalizedLevel.includes("amateur")) {
		return "Amat";
	}

	if (normalizedLevel.includes("professional")) {
		return "Pro";
	}

	return level;
}

export function getSportImage(sportName: string) {
	return sports.find(
		(sport) => sport.name.toLowerCase() === sportName.toLowerCase(),
	)?.image;
}
