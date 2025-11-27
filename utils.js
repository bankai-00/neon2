export function uid(){
  // simple random id
  return 'id-'+Math.random().toString(36).slice(2,10)
}

export function slugify(text){
  return String(text).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/[\s_-]+/g,'-')
    .replace(/^-+|-+$/g,'')
}

export function escapeHtml(unsafe){
  if(unsafe==null) return ''
  return String(unsafe).replace(/[&<>"'`]/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","`":"&#x60;"})[m]
  })
}

export function nl2br(text){
  return escapeHtml(text).replace(/\n/g,'<br>')
}

export function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    const reader = new FileReader()
    reader.onload = ()=>res(reader.result)
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}
