export default (e, id, handler, stopPropagation) => {
  e.stopPropagation()

  if (e.keyCode === 13) {
    if (stopPropagation === 'fontVariant') {
      return document.querySelector('#gfpdf-font-variant-' + id).click()
    }

    if (stopPropagation) {
      return handler(e, id)
    }

    handler(id)
  }
}
