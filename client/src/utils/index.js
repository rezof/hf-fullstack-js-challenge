const makeRequest = (
  url,
  options = { method: 'get' },
  useAuthorization = true
) => {
  const token = localStorage.getItem('token')
  const { headers = {}, ...rest } = options
  let newHeaders = headers
  // append Authorization header to headers
  if (useAuthorization) {
    newHeaders = Object.assign(newHeaders, {
      Authorization: token,
      Accept: 'application/json'
    })
  }
  return fetch(url, { ...rest, headers: newHeaders })
}

export { makeRequest }
