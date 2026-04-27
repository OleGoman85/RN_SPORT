import { useUser } from '@clerk/expo'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Alert } from 'react-native'
import { SelectedSport } from '../types/profile'
import { useState } from 'react'

const API_URL = 'http://localhost:5001'

export function useProfileForm() {
	const { user } = useUser()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [nickname, setNickname] = useState('')
	const [aboutMe, setAboutMe] = useState('')
	const [age, setAge] = useState('')
	const [sex, setSex] = useState('')
	const [country, setCountry] = useState('')
	const [city, setCity] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [latitude, setLatitude] = useState<number | null>(null)
	const [longitude, setLongitude] = useState<number | null>(null)
	const [selectedSports, setSelectedSports] = useState<SelectedSport[]>([])
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
	const [isSaving, setIsSaving] = useState(false)

	const email = user?.primaryEmailAddress?.emailAddress ?? ''

	const isFormValid =
		firstName.trim() &&
		lastName.trim() &&
		nickname.trim() &&
		aboutMe.trim() &&
		age.trim() &&
		sex.trim() &&
		country.trim() &&
		city.trim() &&
		avatarUrl.trim() &&
		selectedSports.length > 0 &&
		selectedLanguages.length > 0

	const handlePickAvatarFromGallery = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permission.granted) {
			Alert.alert('Permission denied', 'Gallery permission is required.')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		})

		if (!result.canceled) {
			setAvatarUrl(result.assets[0].uri)
		}
	}

	const handleTakeAvatarPhoto = async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync()

		if (!permission.granted) {
			Alert.alert('Permission denied', 'Camera permission is required.')
			return
		}

		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		})

		if (!result.canceled) {
			setAvatarUrl(result.assets[0].uri)
		}
	}

	const handleUseMyLocation = async () => {
		const permission = await Location.requestForegroundPermissionsAsync()

		if (permission.status !== 'granted') {
			Alert.alert('Location permission denied')
			return
		}

		const currentLocation = await Location.getCurrentPositionAsync({})

		setLatitude(currentLocation.coords.latitude)
		setLongitude(currentLocation.coords.longitude)

		const address = await Location.reverseGeocodeAsync({
			latitude: currentLocation.coords.latitude,
			longitude: currentLocation.coords.longitude,
		})

		if (address.length > 0) {
			setCountry(address[0].country ?? '')
			setCity(address[0].city ?? address[0].region ?? '')
		}
	}

	const handleToggleSport = (sportName: string) => {
		const alreadySelected = selectedSports.find((sport) => sport.sport_name === sportName)

		if (alreadySelected) {
			setSelectedSports((currentSports) =>
				currentSports.filter((sport) => sport.sport_name !== sportName)
			)
			return
		}

		setSelectedSports((currentSports) => [
			...currentSports,
			{
				sport_name: sportName,
				level: 'Beginner',
			},
		])
	}

	const handleChangeSportLevel = (sportName: string, level: string) => {
		setSelectedSports((currentSports) =>
			currentSports.map((sport) => {
				if (sport.sport_name === sportName) {
					return {
						...sport,
						level,
					}
				}

				return sport
			})
		)
	}

	const getSportLevel = (sportName: string) => {
		const selectedSport = selectedSports.find((sport) => sport.sport_name === sportName)

		return selectedSport?.level
	}

	const handleToggleLanguage = (language: string) => {
		const alreadySelected = selectedLanguages.includes(language)

		if (alreadySelected) {
			setSelectedLanguages((currentLanguages) =>
				currentLanguages.filter((currentLanguage) => currentLanguage !== language)
			)
			return
		}

		setSelectedLanguages((currentLanguages) => [...currentLanguages, language])
	}

	const handleSaveProfile = async () => {
		if (!user?.id || !email) {
			Alert.alert('User is not loaded yet')
			return
		}

		if (!isFormValid) {
			Alert.alert('Please fill all required fields')
			return
		}

		setIsSaving(true)

		try {
			const response = await fetch(`${API_URL}/api/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					clerk_user_id: user.id,
					email,
					first_name: firstName,
					last_name: lastName,
					nickname,
					about_me: aboutMe,
					age: Number(age),
					sex,
					country,
					city,
					avatar_url: avatarUrl,
					latitude,
					longitude,
					sports: selectedSports,
					languages: selectedLanguages,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				Alert.alert('Error', data.message ?? 'Failed to save profile')
				return
			}

			Alert.alert('Success', 'Profile saved successfully')
		} catch (error) {
			console.log(error)
			Alert.alert('Error', 'Could not connect to server')
		} finally {
			setIsSaving(false)
		}
	}

	return {
		firstName,
		setFirstName,
		lastName,
		setLastName,
		nickname,
		setNickname,
		aboutMe,
		setAboutMe,
		age,
		setAge,
		sex,
		setSex,
		country,
		setCountry,
		city,
		setCity,
		avatarUrl,
		latitude,
		longitude,
		selectedSports,
		selectedLanguages,
		isSaving,
		isFormValid,
		handlePickAvatarFromGallery,
		handleTakeAvatarPhoto,
		handleUseMyLocation,
		handleToggleSport,
		handleChangeSportLevel,
		getSportLevel,
		handleToggleLanguage,
		handleSaveProfile,
	}
}
