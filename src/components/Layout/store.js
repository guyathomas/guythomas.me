import React from "react"

import { ACTIONS } from "./actions"

const initialState = {
  isNavigationExpanded: false,
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.NAVIGATION_TOGGLE:
      return { ...state, isNavigationExpanded: !state.isNavigationExpanded }
    default:
      return state
  }
}

const useAppState = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = {
    toggleNavigation: () => dispatch({ type: ACTIONS.NAVIGATION_TOGGLE }),
  }
  return { state, dispatchers }
}

export { useAppState }
