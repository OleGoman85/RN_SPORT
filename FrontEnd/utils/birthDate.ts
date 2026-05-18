export type BirthDateParts = {
	day: string;
	month: string;
	year: string;
};

export function buildDateOfBirth({
	day,
	month,
	year,
}: BirthDateParts): string {
	const normalizedDay = day.trim().padStart(2, "0");
	const normalizedMonth = month.trim().padStart(2, "0");
	const normalizedYear = year.trim();

	return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

export function splitDateOfBirth(dateOfBirth: string | null): BirthDateParts {
	if (!dateOfBirth) {
		return {
			day: "",
			month: "",
			year: "",
		};
	}

	const [year, month, day] = dateOfBirth.split("-");

	return {
		day: day ?? "",
		month: month ?? "",
		year: year ?? "",
	};
}

export function isValidBirthDate({
	day,
	month,
	year,
}: BirthDateParts): boolean {
	if (!day.trim() || !month.trim() || !year.trim()) {
		return false;
	}

	const numericDay = Number(day);
	const numericMonth = Number(month);
	const numericYear = Number(year);

	if (
		Number.isNaN(numericDay) ||
		Number.isNaN(numericMonth) ||
		Number.isNaN(numericYear) ||
		numericDay < 1 ||
		numericDay > 31 ||
		numericMonth < 1 ||
		numericMonth > 12 ||
		year.trim().length !== 4
	) {
		return false;
	}

	const dateOfBirth = buildDateOfBirth({
		day,
		month,
		year,
	});

	const date = new Date(dateOfBirth);
	const today = new Date();

	if (Number.isNaN(date.getTime())) {
		return false;
	}

	if (date > today) {
		return false;
	}

	return (
		date.getFullYear() === numericYear &&
		date.getMonth() + 1 === numericMonth &&
		date.getDate() === numericDay
	);
}
