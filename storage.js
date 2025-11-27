/* storage.js
   Simple client-side storage wrapper using localStorage.
   Keys: 'neon_users', 'neon_projects', 'neon_messages', 'neon_session'
*/
export const STORAGE_KEYS = {
  USERS: 'neon_users',
  PROJECTS: 'neon_projects',
  MESSAGES: 'neon_messages',
  SESSION: 'neon_session'
}

function read(key){
  try{
    const raw = localStorage.getItem(key)
    return raw? JSON.parse(raw) : null
  }catch(e){
    console.error('storage read error',e)
    return null
  }
}

function write(key,val){
  localStorage.setItem(key,JSON.stringify(val))
}

export function getUsers(){
  return read(STORAGE_KEYS.USERS) || []
}

export function saveUsers(users){
  write(STORAGE_KEYS.USERS,users)
}

export function getProjects(){
  return read(STORAGE_KEYS.PROJECTS) || []
}

export function saveProjects(projects){
  write(STORAGE_KEYS.PROJECTS,projects)
}

export function getMessages(){
  return read(STORAGE_KEYS.MESSAGES) || []
}

export function saveMessages(messages){
  write(STORAGE_KEYS.MESSAGES,messages)
}

export function setSession(session){
  write(STORAGE_KEYS.SESSION,session)
}

export function getSession(){
  return read(STORAGE_KEYS.SESSION) || null
}

export function clearSession(){
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}
