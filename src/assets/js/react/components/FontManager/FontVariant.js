import React from 'react'
import PropTypes from 'prop-types'
import FontVariantLabel from './FontVariantLabel'
import fontManagerHandleKeyPress from '../../utilities/fontManagerHandleKeyPress'

export const FontVariant = ({
  fontStyles,
  validateRegular,
  onHandleUpload,
  onHandleDeleteFontStyle,
  msg: { error },
  tabIndexFontFiles
}) => (
  <div id='gfpdf-font-files-setting'>
    {Object.entries(fontStyles).map(([key, font]) => {
      const regular = key === 'regular' && !validateRegular && fontStyles.regular === ''
      const err = error && typeof error.addFont === 'object' && error.addFont[key]

      return (
        <label
          key={key}
          htmlFor={'gfpdf-font-variant-' + key}
          className={'drop-zone' + (err ? ' error' : font ? ' active' : regular ? ' required' : '')}
          onKeyDown={e => fontManagerHandleKeyPress(e, key, onHandleUpload, 'fontVariant')}
          tabIndex={tabIndexFontFiles}
        >
          {font ? (
            <input id={'gfpdf-font-variant-' + key} onClick={e => onHandleDeleteFontStyle(e, key)} accept='.ttf' />
          ) : (
            <input id={'gfpdf-font-variant-' + key} type='file' name={key} onChange={onHandleUpload} accept='.ttf' />
          )}

          <span className={'gfpdf-font-filename ' + (regular && 'required')}>
            {font && typeof font !== 'object' && font.substr(font.lastIndexOf('/') + 1)}
            {!err && font ? font.name : err}
          </span>

          <span className={'dashicons dashicons-' + (font ? 'trash' : 'plus')} />

          <FontVariantLabel label={key} />
        </label>
      )
    })}
  </div>
)

FontVariant.propTypes = {
  fontStyles: PropTypes.object.isRequired,
  validateRegular: PropTypes.bool.isRequired,
  onHandleUpload: PropTypes.func.isRequired,
  onHandleDeleteFontStyle: PropTypes.func.isRequired,
  msg: PropTypes.object.isRequired,
  tabIndexFontFiles: PropTypes.string.isRequired
}

export default FontVariant
