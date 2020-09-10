import React from 'react'
import PropTypes from 'prop-types'

const FontVariantLabel = ({ label }) => (
  <label htmlFor={'gfpdf-font-variant-' + label}>
    {label === 'regular' && <span>Regular <span className='required'> (required)</span></span>}
    {label === 'italics' && 'Italic'}
    {label === 'bold' && 'Bold'}
    {label === 'bolditalics' && 'Bold Italic'}
  </label>
)

FontVariantLabel.propTypes = {
  label: PropTypes.string.isRequired
}

export default FontVariantLabel
