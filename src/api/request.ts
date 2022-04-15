import qs from 'qs'

// @ts-ignore
const baseApi: string = import.meta.env.VITE_APP_API_HOST || ''
const initialConfig = {
  method: 'GET',
  params: null,
  body: null,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  credentials: true,
  responseType: 'JSON',
  cache: 'no-cache',
}

// 校验是否为纯粹的对象
const isPlainObject = obj => {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  const proto = Object.getPrototypeOf(obj)
  if (!proto) {
    return true
  }
  const Ctor = proto.hasOwnProperty('constructor') && proto.constructor
  // 构造函数是 Object
  return typeof Ctor === 'function' && Ctor === Object
}

const get = (url, params): Promise<any> => {
  return request(url, {method: 'get', params: params})
}

// request
const request = (url, config): Promise<any> => {
  // 合并配置项，不要去更改 initialConfig 中的内容
  // 确保 config 肯定是对象
  (config == null || typeof config !== 'object') ? config = {} : null
  if (config.headers && isPlainObject(config.headers)) {
    config.headers = Object.assign({}, initialConfig.headers, config.headers)
  }

  // 合并 config
  let {
    method,
    params,
    body,
    headers,
    credentials,
    responseType,
    cache,
  } = Object.assign({}, initialConfig, config)

  if (typeof url !== 'string') {
    throw new TypeError(`${url} is not an string!`)
  }

  // 判断是不是以 http 或者 https 开头，如果不是,就用 baseApi 拼起来
  if (!/^http(s?):\/\//i.test(url)) {
    url = baseApi + url
  }

  // 不是 null 和 undefined，存在 params
  if (params != null) {
    if (isPlainObject(params)) {
      params = qs.stringify(params)
    }
    // 拼接
    url += `${url.includes('?') ? '&' : '?'}${params}`
  }

  // 处理请求主体的数据格式，根据 headers 中的 Content-Type 处理成为指定的格式
  if (body != null) {
    if (isPlainObject(body)) {
      // 默认 application/json
      let contentType = headers['Content-Type'] || 'application/json'
      body = contentType.includes('urlencoded') ? qs.stringify(body) : contentType.includes('json') ? JSON.stringify(body) : body
    }
  }

  // 处理 credentials，如果传递的是 true，我们让其为 include，否则是 same-origin
  // include，允许跨域请求当中携带资源凭证 same-origin，允许同源性请求当中携带资源凭证
  credentials = credentials ? 'include' : 'same-origin'

  // 基于 fetch 请求数据
  method = method.toUpperCase()
  responseType = responseType.toUpperCase()
  config = {
    method,
    credentials,
    cache,
    headers,
  }

  config.body = /^(POST|PUT|PATCH)$/i.test(method) ? body : null

  return fetch(url, config).then(response => {
    // 走到这边不一定是成功的：
    // Fetch 的特点的是，只要服务器有返回结果，不论状态码是多少，它都认为是成功
    let {
      status,
      statusText,
    } = response
    if (status >= 200 && status < 400) {
      // 真正成功获取数据
      let result
      switch (responseType) {
        case 'TEXT':
          result = response.text()
          break
        case 'JSON':
          result = response.json()
          break
        case 'BLOB':
          result = response.blob()
          break
        case 'ARRAYBUFFER':
          result = response.arrayBuffer()
          break
      }
      return result
    }
    // 应该是失败的处理
    return Promise.reject({
      code: 'STATUS ERROR',
      status,
      statusText,
    })
  }).catch(reason => {
    // @1:状态码失败
    if (reason && reason.code === 'STATUS ERROR') {
      switch (reason.status) {
        case 401:
          break
      }
    }

    // @2:断网
    if (!navigator.onLine) {
      // ...
    }

    // @3:处理返回数据格式失败
    // ...

    return Promise.reject(reason)
  })
}

export {
  baseApi,
  request,
  get,
}
