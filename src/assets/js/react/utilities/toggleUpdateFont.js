export function toggleUpdateFont (history, fontId) {
  const addFontColumn = document.querySelector('.add-font-column div:nth-child(2)')
  const editFontColumn = document.querySelector('.slide-update-font')

  if (fontId) {
    const pathname = history.location.pathname

    if (pathname.substr(pathname.lastIndexOf('/') + 1) === fontId) {
      return removeClass(addFontColumn, editFontColumn, history)
    }

    return addClass(addFontColumn, editFontColumn, history, fontId)
  }

  return removeClass(addFontColumn, editFontColumn, history)
}

export function removeClass (addFontColumn, editFontColumn, history) {
  editFontColumn.classList.remove('show')

  return history.push('/fontmanager/')
}

export function addClass (addFontColumn, editFontColumn, history, fontId) {
  editFontColumn.classList.add('show')

  return history.push('/fontmanager/' + fontId)
}
