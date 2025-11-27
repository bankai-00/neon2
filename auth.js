/*
 * Neonfolio - Client-side Auth Module (localStorage)
 * Provides simple user storage and authentication WITHOUT a backend.
 * This is for demo/testing only. Do NOT use in production.
 *
 * Exposed API (window.Auth):
 * - loadUsers() -> Array of users
 * - saveUsers(users)
 * - seedAdminIfNeeded()
 * - registerUser({ name, email, password }) -> created user (throws on error)
 * - authenticate(email, password) -> user or null
 * - setCurrentUser(user)
 * - getCurrentUser() -> user or null
 * - logout()
 *
 * User object shape:
 * { id, name, email, password (base64), createdAt }
 */
(function(window){
  const KEY_USERS = 'users';
  const KEY_CURRENT = 'currentUser';

  function loadUsers(){
    try { return JSON.parse(localStorage.getItem(KEY_USERS) || '[]'); } catch(e){ return []; }
  }

  function saveUsers(users){ localStorage.setItem(KEY_USERS, JSON.stringify(users)); }

  function seedAdminIfNeeded(){
    const users = loadUsers();
    if (users.length) return;
    const admin = { id: 'admin_1', name: 'Admin', email: 'admin@neonfolio.test', password: btoa('Admin123!'), createdAt: new Date().toISOString() };
    users.push(admin); saveUsers(users);
    console.info('Auth: seeded admin user (admin@neonfolio.test / Admin123!)');
  }

  function findUserByEmail(email){
    const users = loadUsers();
    return users.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase()) || null;
  }

  function registerUser({ name, email, password }){
    if (!name || !email || !password) throw new Error('Missing fields');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
    const users = loadUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already registered');
    const user = { id: 'u_' + Date.now(), name, email, password: btoa(password), createdAt: new Date().toISOString() };
    users.push(user); saveUsers(users);
    return user;
  }

  function authenticate(email, password){
    const user = findUserByEmail(email);
    if (!user) return null;
    if (user.password !== btoa(password)) return null;
    // Return a minimal public user object
    return { id: user.id, name: user.name, email: user.email };
  }

  function setCurrentUser(user){
    if (!user) return; localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
  }

  function getCurrentUser(){
    try { return JSON.parse(localStorage.getItem(KEY_CURRENT)); } catch(e){ return null; }
  }

  function logout(){ localStorage.removeItem(KEY_CURRENT); }

  // Expose API
  window.Auth = {
    loadUsers,
    saveUsers,
    seedAdminIfNeeded,
    registerUser,
    authenticate,
    setCurrentUser,
    getCurrentUser,
    logout
  };

})(window);
import { getUsers, saveUsers, setSession, getSession, clearSession } from './storage.js'
import { uid, slugify } from './utils.js'

async function hashPassword(password){
  const enc = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
}

export async function register({email, password, name}){
  const users = getUsers()
  if(users.find(u=>u.email === email)) throw new Error('Email already registered')
  const id = uid()
  const pwdHash = await hashPassword(password)
  const user = {id, email, name: name||'', pwdHash, slug: slugify(name||email), createdAt: Date.now()}
  users.push(user)
  saveUsers(users)
  // create session
  setSession({userId:id})
  return user
}

export async function login({email,password}){
  const users = getUsers()
  const user = users.find(u=>u.email===email)
  if(!user) throw new Error('Invalid credentials')
  const hash = await hashPassword(password)
  if(hash !== user.pwdHash) throw new Error('Invalid credentials')
  setSession({userId:user.id})
  return user
}

export function logout(){
  clearSession()
}

export function currentUser(){
  const s = getSession()
  if(!s || !s.userId) return null
  const users = getUsers()
  return users.find(u=>u.id===s.userId) || null
}
