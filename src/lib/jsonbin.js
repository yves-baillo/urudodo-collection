
const BIN_ID = "6ac7750dac6210605a1f3419";
const MASTER_KEY = "$2a$10$Kxyjo9JsKFP5Q5mvoLVrbesySn6z4HJqjwMi4pCMV3w/3QX.vlxay";
const BASE_URL = "https://api.jsonbin.io/v3/b";

// ── Default admin (used if bin has no admin data yet) ──
export const DEFAULT_ADMIN = {
  username: 'yves-baillo',
  password: 'urudodo2026',
  avatar: '',
};

// ══════════════════════════════════
// CORE HELPERS
// ══════════════════════════════════

async function readRecord() {
  const res = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
    method: 'GET',
    headers: { 'X-Master-Key': MASTER_KEY },
  });

  if (!res.ok) {
    throw new Error(`Read failed: ${res.status}`);
  }

  const data = await res.json();
  return data.record || {};
}

async function writeRecord(record) {
  const res = await fetch(`${BASE_URL}/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY,
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    throw new Error(`Update failed: ${res.status}`);
  }

  return res.json();
}

// ══════════════════════════════════
// PRODUCTS
// ══════════════════════════════════

export async function getProducts() {
  const record = await readRecord();
  const products = record.products;
  return Array.isArray(products) ? products : [];
}

export async function saveProducts(products) {
  const record = await readRecord();
  return writeRecord({ ...record, products });
}

export async function addProduct(product) {
  const products = await getProducts();
  products.push(product);
  return saveProducts(products);
}

export async function deleteProduct(id) {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  return saveProducts(filtered);
}

// ══════════════════════════════════
// ADMIN (settings)
// ══════════════════════════════════

export async function getAdmin() {
  const record = await readRecord();
  return { ...DEFAULT_ADMIN, ...(record.admin || {}) };
}

export async function saveAdmin(admin) {
  const record = await readRecord();
  return writeRecord({ ...record, admin });
}

export async function verifyAdmin(username, password) {
  const admin = await getAdmin();
  return (
    username.trim().toLowerCase() === admin.username.toLowerCase() &&
    password === admin.password
  );
}

// ══════════════════════════════════
// MESSAGES (contact form)
// ══════════════════════════════════

export async function getMessages() {
  const record = await readRecord();
  const messages = record.messages;
  return Array.isArray(messages) ? messages : [];
}

export async function saveMessages(messages) {
  const record = await readRecord();
  return writeRecord({ ...record, messages });
}

export async function addMessage(message) {
  const messages = await getMessages();
  messages.push(message);
  return saveMessages(messages);
}

export async function markMessageRead(id, read = true) {
  const messages = await getMessages();
  const updated = messages.map((m) =>
    m.id === id ? { ...m, read } : m
  );
  return saveMessages(updated);
}

export async function deleteMessage(id) {
  const messages = await getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  return saveMessages(filtered);
}