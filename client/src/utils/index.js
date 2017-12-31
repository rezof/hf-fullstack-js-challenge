const makeRequest = (
  url,
  options = { method: 'get' },
  useAuthorization = true
) => {
  const token = localStorage.getItem('token')
  const { headers = {}, ...rest } = options
  let newHeaders = headers
  if (useAuthorization) {
    newHeaders = Object.assign(newHeaders, {
      Authorization: token,
      Accept: 'application/json'
    })
    console.log('use auth', token)
  }
  console.log('newHeaders', newHeaders)
  return fetch(url, { ...rest, headers: newHeaders })
}

export { makeRequest }
