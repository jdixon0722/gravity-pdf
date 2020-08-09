import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCustomFontList } from '../../actions/fontManager'

const FontListError = ({ error, getCustomFontList }) => (
  <div className='error'>
    <span>{error}</span>

    <p className='' onClick={getCustomFontList}>Try again</p>
  </div>
)

FontListError.propTypes = {
  error: PropTypes.string.isRequired,
  getCustomFontList: PropTypes.func.isRequired
}

export default connect(null, { getCustomFontList })(FontListError)
