import { escapeHtml, nl2br } from './utils.js'

export function el(q, root=document){ return root.querySelector(q) }
export function els(q, root=document){ return Array.from(root.querySelectorAll(q)) }

export function renderTemplate(id, target='#route-root'){
  const tpl = document.getElementById(id)
  if(!tpl) return
  const root = document.querySelector(target)
  root.innerHTML = ''
  root.appendChild(tpl.content.cloneNode(true))
}

export function showMessage(msg, type='info'){
  // simple toast via alert fallback
  // for prototype, use alert for accessibility
  alert(msg)
}

export function confirmAction(message){
  return confirm(message)
}

export function safeHtml(text){
  return nl2br(text)
}
