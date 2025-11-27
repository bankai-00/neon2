// firebase-init.js
// Dynamically imports Firebase SDK and initializes app with provided config.
// Use by creating `firebase-config.js` at project root that `export default { ... }`.

export async function tryInitFirebase(){
  try{
    // try to import local config file (user must create this from firebase-config.example.js)
    const cfgModule = await import('../firebase-config.js')
    const config = cfgModule.default
    if(!config) return {available:false}

    // dynamic import of firebase SDK modules (modular v9+)
    const [{initializeApp},{getApps}], authMod, fsMod, storageMod = await Promise.all([
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js')
    ])

    const { initializeApp: _initializeApp } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js')
    const app = _initializeApp(config)
    const auth = (await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'))
    const firestore = (await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'))
    const storage = (await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js'))

    return {available:true, app, auth, firestore, storage}
  }catch(err){
    // no firebase-config.js or SDK load failed
    return {available:false, error:err}
  }
}
