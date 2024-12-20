const ENDPOINT_STATUS = '/status'
const ENDPOINT_LOG = '/log'

function closeCurrentWindow() {
  window.close()
}

async function reportRaw(endpoint, data, tryBeacon) {
  data = JSON.stringify(data)
  if (tryBeacon && typeof navigator === 'object' && 'sendBeacon' in navigator) {
    data = (new TextEncoder()).encode(data)
    data = data.buffer
    navigator.sendBeacon(endpoint, data)
  } else {
    await fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export async function reportSuccess() {
  await reportRaw(ENDPOINT_STATUS, { success: true }, true)
  closeCurrentWindow()
}

export async function reportError(error) {
  let msg = 'Unknown error'
  if (typeof error === 'string') {
    msg = error
  } else if (typeof error === 'object') {
    if (error instanceof Error) {
      msg = error.message
    } else if (error !== null) {
      msg = `${error}`
    }
  } else {
    msg = `${error}`
  }
  await reportRaw(ENDPOINT_STATUS, { success: false, error: msg }, true)
  closeCurrentWindow()
}

/**
 * @param message {string}
 */
export async function reportLog(message) {
  await reportRaw(ENDPOINT_LOG, { message }, false)
}
