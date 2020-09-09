export default (fontList) => {
  const defaultFontSelectBox = document.querySelector('.gfpdf_settings_default_font ')
  const definedFontsOptgroup = document.querySelector('optgroup[label="User-Defined Fonts"]')

  if (definedFontsOptgroup !== null) {
    /* Remove optgroup */
    definedFontsOptgroup.remove()
  }

  const optgroup = document.createElement('optgroup')
  optgroup.setAttribute('label', 'User-Defined Fonts')

  fontList.map(font => {
    const option = document.createElement('option')
    option.text = font.font_name
    option.value = font.shortname

    optgroup.appendChild(option)
  })

  defaultFontSelectBox.insertBefore(optgroup, defaultFontSelectBox.childNodes[0])
}
