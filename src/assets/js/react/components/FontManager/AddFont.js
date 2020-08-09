import React from 'react'
import PropTypes from 'prop-types'
import FontVariant from './FontVariant'
import AddFontFooter from './AddFontFooter'

export const AddFont = (
  {
    style,
    id,
    label,
    onHandleInputChange,
    onHandleUpload,
    onHandleDeleteFontStyle,
    onHandleCancelEditFont,
    onHandleSubmit,
    fontStyles,
    validateLabel,
    validateRegular,
    msg,
    tabIndexFontName,
    tabIndexFontFiles
  }
) => (
  <div className={style}>
    <form onSubmit={onHandleSubmit}>
      <h2>{id ? 'Update Font' : 'Add Font'}</h2>
      <p>
        {id ? 'Once saved, PDFs configured to use this font will have your changes applied automatically for newly-generated documents.' : 'Install new fonts for use in your PDF documents.'}
      </p>

      <label htmlFor='gfpdf-add-font-name-input'>
        Font Name <span className='required'>(required)</span>
      </label>
      <p>The font name can only contain alphanumeric characters or spaces.</p>
      <input
        type='text'
        id='gfpdf-add-font-name-input'
        className={!validateLabel ? 'input-label-validation-error' : ''}
        name='label'
        value={label}
        maxLength='37'
        onChange={onHandleInputChange}
        tabIndex={tabIndexFontName}
      />
      {!validateLabel && <span className='required'><em>validation error</em></span>}

      <label>Font Files <span className='required'>(required: Regular)</span></label>
      <p>
        Select or drag and drop your .ttf font file for the variants below. Only the Regular type is required.
      </p>

      <FontVariant
        fontStyles={fontStyles}
        validateRegular={validateRegular}
        onHandleUpload={onHandleUpload}
        onHandleDeleteFontStyle={onHandleDeleteFontStyle}
        msg={msg}
        tabIndexFontFiles={tabIndexFontFiles}
      />

      <AddFontFooter
        id={id}
        onHandleCancelEditFont={onHandleCancelEditFont}
        msg={msg}
      />
    </form>
  </div>
)

AddFont.propTypes = {
  style: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  onHandleInputChange: PropTypes.func.isRequired,
  onHandleUpload: PropTypes.func.isRequired,
  onHandleDeleteFontStyle: PropTypes.func.isRequired,
  onHandleCancelEditFont: PropTypes.func.isRequired,
  onHandleSubmit: PropTypes.func.isRequired,
  validateLabel: PropTypes.bool.isRequired,
  validateRegular: PropTypes.bool.isRequired,
  fontStyles: PropTypes.object.isRequired,
  msg: PropTypes.object.isRequired,
  tabIndexFontName: PropTypes.string.isRequired,
  tabIndexFontFiles: PropTypes.string.isRequired
}

export default AddFont
