import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FontListHeader from './FontListHeader'
import FontListItems from './FontListItems'
import FontListSkeleton from './FontListSkeleton'
import FontListError from './FontListError'

const FontList = ({ id, loading, msg: { error }, history }) => (
  <div className='font-list'>
    <FontListHeader />

    {loading ? <FontListSkeleton /> : <FontListItems id={id} history={history} />}

    {error && error.fontList && <FontListError error={error.fontList} />}
  </div>
)

const mapStateToProps = state => ({
  loading: state.fontManager.loading,
  msg: state.fontManager.msg
})

FontList.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  msg: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default connect(mapStateToProps, {})(FontList)
