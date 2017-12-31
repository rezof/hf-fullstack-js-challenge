const makeRequest = (url, options = { method: 'get' }) => {
  const token = localStorage.getItem('access_token')
  const { headers = {} } = options
  const newHeaders = Object.assign(headers, {
    Authorization: token,
    Accept: 'application/json'
  })
  return fetch(url, { ...options, headers: newHeaders })
}

export { makeRequest }
