import { ContactUser } from "../types/contacts";
import { API_URL } from "./apiConfig";

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}

export async function loadContacts(
  currentClerkUserId: string,
): Promise<ContactUser[]> {
  const response = await fetch(
    `${API_URL}/api/contacts/${encodeURIComponent(currentClerkUserId)}`,
  );

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load contacts.");
  }

  return data.contacts ?? [];
}

export async function addContactToBook(
  currentClerkUserId: string,
  contactClerkUserId: string,
): Promise<{
  contact: ContactUser;
  is_new: boolean;
}> {
  const response = await fetch(`${API_URL}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_clerk_user_id: currentClerkUserId,
      contact_clerk_user_id: contactClerkUserId,
    }),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not add contact.");
  }

  return data;
}

export async function removeContactFromBook(
  currentClerkUserId: string,
  contactClerkUserId: string,
) {
  const response = await fetch(
    `${API_URL}/api/contacts/${encodeURIComponent(contactClerkUserId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_clerk_user_id: currentClerkUserId,
      }),
    },
  );

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not remove contact.");
  }

  return data;
}
