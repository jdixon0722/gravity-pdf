import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import FontVariantLabel from './FontVariantLabel'

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
        <Dropzone
          key={key}
          accept='.ttf'
          onDrop={acceptedFiles => onHandleUpload(key, acceptedFiles[0])}
        >
          {({ getRootProps, getInputProps }) => (
            <a
              className={'drop-zone' + (err ? ' error' : font ? ' active' : regular ? ' required' : '')}
              {...getRootProps()}
              tabIndex={tabIndexFontFiles}
            >
              {font ? (
                <input
                  id={'gfpdf-font-variantt-' + key}
                  {...getInputProps({ onClick: e => onHandleDeleteFontStyle(e, key) })}
                />
              ) : <input id={'gfpdf-font-variant-' + key} {...getInputProps()} />}

              <span className={'gfpdf-font-filename ' + (regular && 'required')}>
                {font && typeof font !== 'object' && font.substr(font.lastIndexOf('/') + 1)}
                {!err && font ? font.name : err}
              </span>

              <span className={'dashicons dashicons-' + (font ? 'trash' : 'plus')} />

              <FontVariantLabel label={key} font={font ? 'true' : 'false'} />
            </a>
          )}
        </Dropzone>
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
