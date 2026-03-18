const STORAGE_KEY = 'mp2p_identity';
const CONTACTS_KEY = 'mp2p_contacts';
const MESSAGES_KEY = 'mp2p_messages';

export function saveIdentity(identity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

export function loadIdentity() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearIdentity() {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function loadContacts() {
  const data = localStorage.getItem(CONTACTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function loadMessages() {
  const data = localStorage.getItem(MESSAGES_KEY);
  return data ? JSON.parse(data) : {};
}
