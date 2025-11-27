import { registerRoute, startRouter } from './router.js'
import * as storage from './storage.js'
import * as auth from './auth.js'
import { uid, slugify, readFileAsDataURL, escapeHtml, nl2br } from './utils.js'
import { el, renderTemplate, showMessage, confirmAction, safeHtml } from './ui.js'

// Helper to set year
document.getElementById('year').textContent = new Date().getFullYear()

function renderHome(){
  renderTemplate('tmpl-home')
}

function renderAbout(){
  const root = document.getElementById('route-root')
  root.innerHTML = `
    <section class="card">
      <h2>About NeonPort</h2>
      <p>NeonPort is a demo prototype created to showcase a neon, glassmorphism portfolio UI and client-side CRUD features.</p>
      <p class="muted">Creator: <a href="#">Your Name</a> — <a href="#">Twitter</a> — <a href="#">GitHub</a></p>
    </section>`
}

function renderContact(){
  const root = document.getElementById('route-root')
  root.innerHTML = `
    <section class="card">
      <h2>Contact</h2>
      <form id="contact-form" novalidate>
        <label for="c-name">Name</label>
        <input id="c-name" name="name" required />
        <label for="c-email">Email</label>
        <input id="c-email" name="email" type="email" required />
        <label for="c-message">Message</label>
        <textarea id="c-message" name="message" required></textarea>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </section>`

  const form = document.getElementById('contact-form')
  form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const data = {id: uid(), name: form.name.value, email: form.email.value, message: form.message.value, date: Date.now()}
    const msgs = storage.getMessages()
    msgs.push(data)
    storage.saveMessages(msgs)
    showMessage('Message saved locally. For real email delivery, connect a backend or use mailto.')
    form.reset()
  })
}

function renderLogin(){
  const root = document.getElementById('route-root')
  root.innerHTML = `
    <section class="card">
      <h2>Login</h2>
      <form id="login-form" novalidate>
        <label for="l-email">Email</label>
        <input id="l-email" name="email" type="email" required />
        <label for="l-pass">Password</label>
        <input id="l-pass" name="password" type="password" required />
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Sign in</button>
          <a class="btn btn-ghost" href="#/register">Register</a>
        </div>
      </form>
    </section>`

  const form = document.getElementById('login-form')
  form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    try{
      await auth.login({email: form.email.value, password: form.password.value})
      showMessage('Signed in')
      location.hash = '#/dashboard'
      updateAuthLink()
    }catch(err){
      showMessage(err.message)
    }
  })
}

function renderRegister(){
  const root = document.getElementById('route-root')
  root.innerHTML = `
    <section class="card">
      <h2>Register</h2>
      <form id="reg-form" novalidate>
        <label for="r-name">Full name</label>
        <input id="r-name" name="name" required />
        <label for="r-email">Email</label>
        <input id="r-email" name="email" type="email" required />
        <label for="r-pass">Password</label>
        <input id="r-pass" name="password" type="password" minlength="6" required />
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Create account</button>
        </div>
      </form>
    </section>`

  const form = document.getElementById('reg-form')
  form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    try{
      await auth.register({email: form.email.value, password: form.password.value, name: form.name.value})
      showMessage('Account created and signed in')
      updateAuthLink()
      location.hash = '#/dashboard'
    }catch(err){
      showMessage(err.message)
    }
  })
}

function renderDashboard(){
  const user = auth.currentUser()
  if(!user){ location.hash = '#/login'; return }
  const root = document.getElementById('route-root')
  root.innerHTML = `
    <section class="dashboard-grid">
      <aside class="card">
        <h3>Your profile</h3>
        <p><strong>${escapeHtml(user.name||user.email)}</strong></p>
        <p class="muted">Shareable profile: <a href="#/u/${user.slug}">#/u/${user.slug}</a></p>
        <div class="form-actions">
          <button id="btn-logout" class="btn btn-ghost">Logout</button>
        </div>
      </aside>
      <div>
        <div class="card">
          <h3>Create Project</h3>
          <form id="project-form">
            <label>Title<input name="title" required /></label>
            <label>Short description<input name="short" required /></label>
            <label>Long description<textarea name="long"></textarea></label>
            <label>Project URL<input name="url" type="url" placeholder="https://example.com" /></label>
            <label>Tags (comma separated)<input name="tags" /></label>
            <label>Visibility<select name="visibility"><option value="public">Public</option><option value="private">Private</option></select></label>
            <label>Cover image<input id="cover-file" name="cover" type="file" accept="image/*" /></label>
            <label>Gallery (max 6)<input id="gallery-files" name="gallery" type="file" accept="image/*" multiple /></label>
            <div class="file-preview" id="preview-area"></div>
            <div class="form-actions">
              <button class="btn btn-primary" type="submit">Save Project</button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3>Your Projects</h3>
          <div id="projects-list" class="project-list"></div>
        </div>
      </div>
    </section>`

  document.getElementById('btn-logout').addEventListener('click', ()=>{ auth.logout(); updateAuthLink(); location.hash='#/' })

  const form = document.getElementById('project-form')
  const preview = document.getElementById('preview-area')

  document.getElementById('cover-file').addEventListener('change', async (e)=>{
    const f = e.target.files[0]
    if(!f) return
    const data = await readFileAsDataURL(f)
    preview.innerHTML = `<img src="${data}" alt="cover preview" loading="lazy" />`
  })

  document.getElementById('gallery-files').addEventListener('change', async (e)=>{
    const files = Array.from(e.target.files).slice(0,6)
    preview.innerHTML = ''
    for(const f of files){
      const data = await readFileAsDataURL(f)
      const img = document.createElement('img')
      img.src = data; img.loading='lazy'
      preview.appendChild(img)
    }
  })

  form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const f = new FormData(form)
    const title = f.get('title')
    const short = f.get('short')
    const long = f.get('long')
    const url = f.get('url')
    const tags = (f.get('tags')||'').split(',').map(t=>t.trim()).filter(Boolean)
    const visibility = f.get('visibility')
    const coverFile = form.querySelector('#cover-file').files[0]
    const galleryFiles = Array.from(form.querySelector('#gallery-files').files).slice(0,6)
    const cover = coverFile ? await readFileAsDataURL(coverFile) : null
    const gallery = []
    for(const gf of galleryFiles){ gallery.push(await readFileAsDataURL(gf)) }

    const projects = storage.getProjects()
    const id = uid()
    const project = {id, ownerId: user.id, title, short, long, url, tags, visibility, cover, gallery, slug: slugify(title||id), date: Date.now()}
    projects.push(project)
    storage.saveProjects(projects)
    showMessage('Project saved')
    form.reset(); preview.innerHTML=''
    loadProjectList()
  })

  function loadProjectList(){
    const list = document.getElementById('projects-list')
    list.innerHTML = ''
    const projects = storage.getProjects().filter(p=>p.ownerId===user.id)
    if(projects.length===0) list.innerHTML = '<p class="muted">No projects yet</p>'
    projects.forEach(p=>{
      const node = document.createElement('div')
      node.className = 'project-card card'
      node.innerHTML = `
        <div class="project-thumb">${p.cover?'<img src="'+p.cover+'" alt="cover" loading="lazy">':'<span class="muted">No image</span>'}</div>
        <div class="project-info">
          <h4>${escapeHtml(p.title)}</h4>
          <p class="meta">${escapeHtml(p.short||'')}</p>
          <p class="meta"><a href="#/p/${p.id}">View</a> • <a href="#" data-id="${p.id}" class="edit">Edit</a> • <a href="#" data-id="${p.id}" class="delete">Delete</a></p>
        </div>`
      list.appendChild(node)
    })

    // attach handlers
    list.querySelectorAll('.delete').forEach(a=>a.addEventListener('click', (e)=>{
      e.preventDefault(); const id = a.dataset.id || e.target.dataset.id
      if(confirmAction('Delete this project?')){
        const projects = storage.getProjects().filter(pp=>pp.id!==id)
        storage.saveProjects(projects)
        showMessage('Deleted')
        loadProjectList()
      }
    }))
    list.querySelectorAll('.edit').forEach(a=>a.addEventListener('click', (e)=>{
      e.preventDefault(); const id = e.target.dataset.id
      const p = storage.getProjects().find(pp=>pp.id===id)
      if(!p) return
      // Basic edit: prefill the create form for simplicity
      form.title.value = p.title
      form.short.value = p.short
      form.long.value = p.long
      form.url.value = p.url
      form.tags.value = p.tags.join(', ')
      form.visibility.value = p.visibility
      showMessage('Prefilled form — submit to save a NEW project. (Editing inline not implemented in prototype)')
    }))
  }

  loadProjectList()
}

function renderProject({params}){
  const id = params.projectId || params.project
  const projects = storage.getProjects()
  const p = projects.find(x=>x.id===id)
  const root = document.getElementById('route-root')
  if(!p){ root.innerHTML = '<section class="card"><p>Project not found</p></section>'; return }
  if(p.visibility !== 'public'){
    const user = auth.currentUser()
    if(!user || user.id !== p.ownerId){ root.innerHTML = '<section class="card"><p>This project is private.</p></section>'; return }
  }
  const owner = storage.getUsers().find(u=>u.id===p.ownerId) || {slug:'unknown',name:'Unknown'}
  root.innerHTML = `
    <article class="card">
      <h2>${escapeHtml(p.title)}</h2>
      <p class="meta">By <a href="#/u/${owner.slug}">${escapeHtml(owner.name||owner.email)}</a> • ${new Date(p.date).toLocaleDateString()}</p>
      ${p.cover?`<img src="${p.cover}" alt="cover" style="max-width:100%;border-radius:8px;margin:12px 0;" loading="lazy">`:''}
      <p>${safeHtml(p.long||p.short||'')}</p>
      ${p.gallery && p.gallery.length?'<div class="file-preview">'+p.gallery.map(g=>`<img src="${g}" loading="lazy">`).join('')+'</div>':''}
      ${p.url?`<p><a class="btn btn-ghost" href="${p.url}" target="_blank" rel="noopener">Visit project</a></p>`:''}
    </article>`
}

function renderUserProfile({params}){
  const slug = params.userSlug
  const users = storage.getUsers()
  const user = users.find(u=>u.slug===slug)
  const root = document.getElementById('route-root')
  if(!user){ root.innerHTML = '<section class="card"><p>User not found</p></section>'; return }
  const projects = storage.getProjects().filter(p=>p.ownerId===user.id && p.visibility==='public')
  root.innerHTML = `
    <section class="card">
      <h2>${escapeHtml(user.name||user.email)}</h2>
      <p class="muted">Public profile — shareable link</p>
      <div id="public-projects" class="project-list"></div>
    </section>`
  const list = document.getElementById('public-projects')
  if(projects.length===0) list.innerHTML = '<p class="muted">No public projects yet</p>'
  projects.forEach(p=>{
    const node = document.createElement('div')
    node.className='card'
    node.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p class="meta">${escapeHtml(p.short||'')}</p><p><a href="#/p/${p.id}">Open</a></p>`
    list.appendChild(node)
  })
}

function updateAuthLink(){
  const u = auth.currentUser()
  const node = document.querySelector('.auth-link')
  if(u){ node.innerHTML = `<a href="#/dashboard">${escapeHtml(u.name||u.email)}</a>` } else { node.innerHTML = '<a href="#/login">Login</a>' }
}

// register routes
registerRoute('/', renderHome)
registerRoute('/about', renderAbout)
registerRoute('/contact', renderContact)
registerRoute('/login', renderLogin)
registerRoute('/register', renderRegister)
registerRoute('/dashboard', renderDashboard)
registerRoute('/p/:projectId', renderProject)
registerRoute('/u/:userSlug', renderUserProfile)

startRouter(()=>{ document.getElementById('route-root').innerHTML = '<section class="card"><h2>Page not found</h2></section>' })

updateAuthLink()

// Basic nav toggle for mobile
document.querySelectorAll('.nav-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const list = document.getElementById('nav-list')
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    btn.setAttribute('aria-expanded', String(!expanded))
    list.style.display = expanded ? 'none' : 'flex'
    list.setAttribute('aria-hidden', String(expanded))
  })
})
