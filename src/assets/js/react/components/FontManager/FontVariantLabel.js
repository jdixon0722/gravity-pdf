import React from 'react'
import PropTypes from 'prop-types'

const FontVariantLabel = ({ label, font }) => (
  <label htmlFor={'gfpdf-font-variant-' + label}>
    {label === 'regular' && font === 'false' && <span>Regular <span className='required'> (required)</span></span>}
    {label === 'regular' && font === 'true' && 'Regular'}
    {label === 'italics' && 'Italic'}
    {label === 'bold' && 'Bold'}
    {label === 'bolditalics' && 'Bold Italic'}
  </label>
)

FontVariantLabel.propTypes = {
  label: PropTypes.string.isRequired,
  font: PropTypes.string
}

export default FontVariantLabel
