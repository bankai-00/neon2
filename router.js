/* Simple hash-based router
   Routes: '/', '/about', '/contact', '/login', '/register', '/dashboard', '/u/:userSlug', '/p/:projectId'
*/
export const routes = {}

export function registerRoute(path, handler){
  routes[path] = handler
}

function parseHash(hash){
  if(!hash) return '/'
  return hash.replace(/^#/, '') || '/'
}

export function startRouter(notFound){
  function onHash(){
    const path = parseHash(location.hash)
    // find matching route simple pattern
    for(const pattern in routes){
      const keys = []
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, (m)=>{keys.push(m.slice(1));return '([^/]+)'} ) + '$')
      const m = path.match(regex)
      if(m){
        const params = {}
        keys.forEach((k,i)=>params[k]=decodeURIComponent(m[i+1]))
        return routes[pattern]( {path, params} )
      }
    }
    if(notFound) notFound({path})
  }
  window.addEventListener('hashchange', onHash)
  // initial
  onHash()
}
