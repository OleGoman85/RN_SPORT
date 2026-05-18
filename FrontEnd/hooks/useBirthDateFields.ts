import { useMemo, useState } from "react";
import {
	buildDateOfBirth,
	isValidBirthDate,
	splitDateOfBirth,
} from "../utils/birthDate";

export function useBirthDateFields() {
	const [birthDay, setBirthDay] = useState("");
	const [birthMonth, setBirthMonth] = useState("");
	const [birthYear, setBirthYear] = useState("");

	const birthDateIsValid = useMemo(() => {
		return isValidBirthDate({
			day: birthDay,
			month: birthMonth,
			year: birthYear,
		});
	}, [birthDay, birthMonth, birthYear]);

	const dateOfBirth = useMemo(() => {
		return buildDateOfBirth({
			day: birthDay,
			month: birthMonth,
			year: birthYear,
		});
	}, [birthDay, birthMonth, birthYear]);

	const setBirthDateFromProfile = (dateOfBirthFromProfile: string | null) => {
		const birthDate = splitDateOfBirth(dateOfBirthFromProfile);

		setBirthDay(birthDate.day);
		setBirthMonth(birthDate.month);
		setBirthYear(birthDate.year);
	};

	return {
		birthDay,
		setBirthDay,
		birthMonth,
		setBirthMonth,
		birthYear,
		setBirthYear,
		birthDateIsValid,
		dateOfBirth,
		setBirthDateFromProfile,
	};
}
