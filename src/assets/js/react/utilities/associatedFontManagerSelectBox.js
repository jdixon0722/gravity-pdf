export default (fontList) => {
  const defaultFontSelectBox = document.querySelector('.gfpdf_settings_default_font')
  const definedFontsOptgroup = document.querySelector('optgroup[label="User-Defined Fonts"]')
  const selectedValue = defaultFontSelectBox.options[defaultFontSelectBox.selectedIndex].value
  const userDefinedFonts = []

  /* Get current User-Defined Fonts items */
  Array.from(document.querySelectorAll('optgroup[label="User-Defined Fonts"] > option')).map(item => userDefinedFonts.push(item.value))

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

  const list = []

  if (fontList.length > 0) {
    fontList.map(font => list.push(font.shortname))
  }

  let updateSelectBoxValue

  /* Assign default value if selected item is deleted */
  if (userDefinedFonts.includes(selectedValue) && list.length !== 0 && !list.includes(selectedValue)) {
    defaultFontSelectBox.insertBefore(optgroup, defaultFontSelectBox.childNodes[0])
    updateSelectBoxValue = defaultFontSelectBox.selectedIndex = '0'

    return updateSelectBoxValue
  }

  /* Perform deletion for the very last item left */
  if (list.length === 0 && userDefinedFonts.length > 0) {
    updateSelectBoxValue = defaultFontSelectBox.selectedIndex = '0'

    return updateSelectBoxValue
  }

  defaultFontSelectBox.insertBefore(optgroup, defaultFontSelectBox.childNodes[0])
  defaultFontSelectBox.value = selectedValue

  /* Remove User-Defined Fonts field if empty */
  if (userDefinedFonts.length === 0 && list.length === 0) {
    defaultFontSelectBox.querySelector('optgroup[label="User-Defined Fonts"]').remove()
  }
}
