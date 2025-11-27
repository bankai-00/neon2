/* firebase-adapter.js
   Optional adapter to use Firebase Auth, Firestore, and Storage as a backend.
   This file does not automatically replace the existing localStorage prototype.
   Instead you can import and call `initFirebaseAdapter()` to enable Firebase-backed storage and auth.

   NOTE: For security, create a `firebase-config.js` from `firebase-config.example.js`.
*/
import { tryInitFirebase } from './firebase-init.js'

let FB = null

export async function initFirebaseAdapter(){
  if(FB) return FB
  const res = await tryInitFirebase()
  if(!res.available) throw new Error('Firebase not available: ' + (res.error?.message || 'no config'))
  const { auth, firestore, storage } = res

  // helpers (using modular SDK namespaced objects)
  const getAuth = auth.getAuth
  const createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword
  const signInWithEmailAndPassword = auth.signInWithEmailAndPassword
  const signOut = auth.signOut
  const onAuthStateChanged = auth.onAuthStateChanged

  const getFirestore = firestore.getFirestore
  const collection = firestore.collection || firestore.collection // compat
  const getDocs = firestore.getDocs
  const doc = firestore.doc
  const setDoc = firestore.setDoc
  const getDoc = firestore.getDoc
  const updateDoc = firestore.updateDoc
  const deleteDoc = firestore.deleteDoc
  const query = firestore.query
  const where = firestore.where
  const orderBy = firestore.orderBy

  const getStorage = storage.getStorage
  const ref = storage.ref
  const uploadString = storage.uploadString
  const getDownloadURL = storage.getDownloadURL

  const app = res.app
  const a = getAuth(app)
  const db = getFirestore(app)
  const st = getStorage(app)

  FB = {
    app, a, db, st,
    async register({email,password, name}){
      const userCred = await createUserWithEmailAndPassword(a, email, password)
      const u = userCred.user
      const userDoc = { uid: u.uid, email, name, slug: (name||email).toLowerCase().replace(/[^a-z0-9]+/g,'-'), createdAt: Date.now() }
      await setDoc(doc(db, 'users', u.uid), userDoc)
      return userDoc
    },
    async login({email,password}){
      const userCred = await signInWithEmailAndPassword(a, email, password)
      const u = userCred.user
      const snap = await getDoc(doc(db,'users',u.uid))
      return snap.exists() ? snap.data() : { uid: u.uid, email }
    },
    async logout(){ await signOut(a) },
    onAuth(cb){ return onAuthStateChanged(a, cb) },
    // projects collection operations
    async createProject(project, ownerUid){
      // create a document with generated id
      const id = project.id || ('p-'+Date.now())
      const p = { ...project, id, ownerId: ownerUid, date: project.date || Date.now() }
      await setDoc(doc(db,'projects', id), p)
      return p
    },
    async getProjectsForUser(uid){
      const q = query(firestore.collection(db,'projects'), where('ownerId','==',uid), orderBy('date','desc'))
      const snap = await getDocs(q)
      return snap.docs.map(d=>d.data())
    },
    async getPublicProjectsForUserSlug(slug){
      // find user by slug
      const usersSnap = await getDocs(query(firestore.collection(db,'users'), where('slug','==',slug)))
      if(usersSnap.empty) return []
      const uid = usersSnap.docs[0].id
      const q = query(firestore.collection(db,'projects'), where('ownerId','==',uid), where('visibility','==','public'))
      const snap = await getDocs(q)
      return snap.docs.map(d=>d.data())
    },
    async getProjectById(id){
      const snap = await getDoc(doc(db,'projects',id))
      return snap.exists()? snap.data() : null
    },
    async updateProject(id, updates){
      await updateDoc(doc(db,'projects',id), updates)
    },
    async deleteProject(id){
      await deleteDoc(doc(db,'projects',id))
    },
    // storage: upload base64 image and return download URL
    async uploadBase64Image(base64string, path){
      const r = ref(st, path)
      await uploadString(r, base64string, 'data_url')
      return await getDownloadURL(r)
    },
    async saveMessage(message){
      const id = 'm-'+Date.now()
      await setDoc(doc(db,'messages',id), { ...message, id })
    }
  }

  return FB
}
