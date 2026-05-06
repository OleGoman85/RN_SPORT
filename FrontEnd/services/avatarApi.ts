const API_URL = "http://192.168.32.127:5001";

export async function uploadAvatarToServer(imageUri: string) {
	const fileName = imageUri.split("/").pop() ?? "avatar.jpg";
	const fileType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

	const formData = new FormData();

	formData.append("avatar", {
		uri: imageUri,
		name: fileName,
		type: fileType,
	} as any);

	const response = await fetch(`${API_URL}/api/upload/avatar`, {
		method: "POST",
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Avatar upload failed");
	}

	return data.avatar_url as string;
}
