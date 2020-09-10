export function findAndUpdate (data, payload) {
  const list = [...data]

  list.map(font => {
    if (font.id === payload.font.id) {
      font.font_name = payload.font.font_name
      font.regular = payload.font.regular
      font.italics = payload.font.italics
      font.bold = payload.font.bold
      font.bolditalics = payload.font.bolditalics
    }
  })

  return list
}

export function findAndRemove (data, payload) {
  const list = [...data]
  const newList = list.filter(font => font.id !== payload)

  return newList
}

export function reduceFontFileName (key) {
  return key
    .substr(key.lastIndexOf('/') + 1)
    .replace('.ttf', '')
    .toLowerCase()
}

export function checkFontListIncludes (font, payload) {
  return font
    .toLowerCase()
    .includes(payload.toLowerCase())
}

export function clearMsg (payload) {
  const msg = { ...payload }

  /* Clear previous success msg */
  if (msg.success) {
    delete msg.success
  }

  /* Clear previous addFont error msg */
  if (msg.error && msg.error.addFont) {
    delete msg.error.addFont
  }

  return msg
}
