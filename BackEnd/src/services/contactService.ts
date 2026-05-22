import { sql } from "../config/db";

export async function getContactsByClerkUserId(clerkUserId: string) {
	return sql`
    SELECT
      contacts.id,
      contacts.clerk_user_id,
      contacts.first_name,
      contacts.last_name,
      contacts.nickname,
      contacts.about_me,
      TO_CHAR(contacts.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      contacts.sex,
      contacts.country,
      contacts.city,
      contacts.avatar_url,
      contacts.rating_avg,
      contacts.rating_count,
      contacts.games_count,
      user_contacts.created_at AS saved_at,
      (
        SELECT COUNT(*)::int
        FROM sport_events
        WHERE user_id = contacts.id
      ) AS events_created_count,
      (
        SELECT COUNT(*)::int
        FROM sport_event_members
        WHERE user_id = contacts.id
      ) AS participated_events_count
    FROM user_contacts
    INNER JOIN users AS owners ON owners.id = user_contacts.owner_user_id
    INNER JOIN users AS contacts ON contacts.id = user_contacts.contact_user_id
    WHERE owners.clerk_user_id = ${clerkUserId}
    ORDER BY user_contacts.created_at DESC
  `;
}

export async function getContactByUserIds(
	ownerUserId: number,
	contactUserId: number,
) {
	const contacts = await sql`
    SELECT
      contacts.id,
      contacts.clerk_user_id,
      contacts.first_name,
      contacts.last_name,
      contacts.nickname,
      contacts.about_me,
      TO_CHAR(contacts.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      contacts.sex,
      contacts.country,
      contacts.city,
      contacts.avatar_url,
      contacts.rating_avg,
      contacts.rating_count,
      contacts.games_count,
      user_contacts.created_at AS saved_at,
      (
        SELECT COUNT(*)::int
        FROM sport_events
        WHERE user_id = contacts.id
      ) AS events_created_count,
      (
        SELECT COUNT(*)::int
        FROM sport_event_members
        WHERE user_id = contacts.id
      ) AS participated_events_count
    FROM user_contacts
    INNER JOIN users AS contacts ON contacts.id = user_contacts.contact_user_id
    WHERE user_contacts.owner_user_id = ${ownerUserId}
    AND user_contacts.contact_user_id = ${contactUserId}
  `;

	return contacts[0] ?? null;
}

export async function addContact(ownerUserId: number, contactUserId: number) {
	const insertedContacts = await sql`
    INSERT INTO user_contacts (owner_user_id, contact_user_id)
    VALUES (${ownerUserId}, ${contactUserId})
    ON CONFLICT (owner_user_id, contact_user_id)
    DO NOTHING
    RETURNING id
  `;

	const contact = await getContactByUserIds(ownerUserId, contactUserId);

	return {
		contact,
		is_new: insertedContacts.length > 0,
	};
}

export async function removeContact(
	ownerUserId: number,
	contactUserId: number,
) {
	const removedContacts = await sql`
    DELETE FROM user_contacts
    WHERE owner_user_id = ${ownerUserId}
    AND contact_user_id = ${contactUserId}
    RETURNING id
  `;

	return removedContacts.length > 0;
}
