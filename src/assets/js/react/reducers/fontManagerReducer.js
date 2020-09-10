import {
  GET_CUSTOM_FONT_LIST,
  GET_CUSTOM_FONT_LIST_SUCCESS,
  GET_CUSTOM_FONT_LIST_ERROR,
  ADD_FONT,
  ADD_FONT_SUCCESS,
  ADD_FONT_ERROR,
  EDIT_FONT,
  EDIT_FONT_ERROR,
  EDIT_FONT_SUCCESS,
  DELETE_FONT,
  DELETE_FONT_SUCCESS,
  DELETE_FONT_ERROR,
  CLEAR_ADD_FONT_MSG,
  CLEAR_DROPZONE_ERROR,
  RESET_SEARCH_RESULT,
  SEARCH_FONT_LIST
} from '../actions/fontManager'
import {
  findAndUpdate,
  findAndRemove,
  reduceFontFileName,
  checkFontListIncludes,
  clearMsg
} from '../utilities/fontManagerReducer'

export const initialState = {
  loading: false,
  addFontLoading: false,
  fontList: [],
  searchResult: null,
  msg: {}
}

export default function (state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case GET_CUSTOM_FONT_LIST: {
      return {
        ...state,
        loading: true,
        msg: {}
      }
    }

    case GET_CUSTOM_FONT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        fontList: payload
      }

    case GET_CUSTOM_FONT_LIST_ERROR:
      return {
        ...state,
        loading: false,
        msg: { error: { fontList: payload } }
      }

    case ADD_FONT:
      return {
        ...state,
        addFontLoading: true,
        msg: clearMsg({ ...state.msg })
      }

    case ADD_FONT_SUCCESS: {
      if (state.msg.error && state.msg.error.fontList) {
        return {
          ...state,
          addFontLoading: false,
          msg: { ...state.msg, success: { addFont: payload.msg } }
        }
      }

      const updatedFontList = [...state.fontList, payload.font]

      return {
        ...state,
        addFontLoading: false,
        fontList: updatedFontList,
        searchResult: state.searchResult ? updatedFontList : null,
        msg: { success: { addFont: payload.msg } }
      }
    }

    case ADD_FONT_ERROR:
    case EDIT_FONT_ERROR: {
      const msg = { ...state.msg, error: { ...state.msg.error, addFont: payload } }

      /* Clear deleteFont error msg */
      if (msg.error && msg.error.deleteFont) {
        delete msg.error.deleteFont
      }

      return {
        ...state,
        addFontLoading: false,
        msg
      }
    }

    case EDIT_FONT: {
      const msg = { ...state.msg }

      /* Clear previous success msg */
      if (msg.success) {
        delete msg.success
      }

      /* Clear previous addFont error msg */
      if (msg.error && msg.error.addFont) {
        delete msg.error.addFont
      }

      return {
        ...state,
        addFontLoading: true,
        msg
      }
    }

    /**
     * Update fontList state with the new font details
     */
    case EDIT_FONT_SUCCESS: {
      const msg = { success: { addFont: payload.msg } }

      /* Update search result in case there's an ongoing search */
      if (state.searchResult) {
        return {
          ...state,
          addFontLoading: false,
          fontList: findAndUpdate([...state.fontList], payload),
          searchResult: findAndUpdate([...state.searchResult], payload),
          msg
        }
      }

      return {
        ...state,
        addFontLoading: false,
        fontList: findAndUpdate([...state.fontList], payload),
        msg
      }
    }

    case DELETE_FONT: {
      const msg = { ...state.msg }

      /* Clear previous success msg */
      if (msg.success) {
        delete msg.success
      }

      /* Clear previous deleteFont error msg */
      if (msg.error && msg.error.deleteFont) {
        delete msg.error.deleteFont
      }

      return { ...state, msg }
    }

    case DELETE_FONT_SUCCESS: {
      /* Delete from the list during active search */
      if (state.searchResult) {
        return {
          ...state,
          fontList: findAndRemove([...state.fontList], payload),
          searchResult: findAndRemove([...state.searchResult], payload).length === 0 ? null : findAndRemove([...state.searchResult], payload)
        }
      }

      return {
        ...state,
        fontList: findAndRemove([...state.fontList], payload)
      }
    }

    case DELETE_FONT_ERROR:
      return {
        ...state,
        msg: { ...state.msg, error: { ...state.msg.error, deleteFont: payload } }
      }

    case CLEAR_ADD_FONT_MSG:
      return {
        ...state,
        msg: clearMsg({ ...state.msg })
      }

    case CLEAR_DROPZONE_ERROR: {
      const addFont = { ...state.msg.error.addFont }
      delete addFont[payload]

      return {
        ...state,
        msg: { ...state.msg, error: { ...state.msg.error, addFont } }
      }
    }

    case RESET_SEARCH_RESULT:
      return {
        ...state,
        searchResult: null
      }

    case SEARCH_FONT_LIST: {
      const fontList = [...state.fontList]
      const searchResult = []

      const modifiedFontList = fontList.map(font => {
        font.regular = reduceFontFileName(font.regular)
        font.italics = reduceFontFileName(font.italics)
        font.bold = reduceFontFileName(font.bold)
        font.bolditalics = reduceFontFileName(font.bolditalics)

        return { ...font }
      })

      modifiedFontList.map(font => {
        if (
          checkFontListIncludes(font.font_name, payload) ||
          checkFontListIncludes(font.regular, payload) ||
          checkFontListIncludes(font.italics, payload) ||
          checkFontListIncludes(font.bold, payload) ||
          checkFontListIncludes(font.bolditalics, payload)
        ) {
          searchResult.push(font)
        }
      })

      return { ...state, searchResult: searchResult }
    }

    default:
      return state
  }
}
