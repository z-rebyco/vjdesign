import html from '../../internal/profile/components'
import internalProperties from '../../internal/profile/properties'
import internalDatasource from '../../internal/profile/datasource'

const commonProperties = [
  'remark',
  'condition',
  'fieldOptions.ref',
  'fieldOptions.slot',
  'fieldOptions.scopedSlot',
  'fieldOptions.class',
  'fieldOptions.style'
]

const reduceProperty = (prev, cur) => {
  prev[cur.name] = cur
  return prev
}

const reduceComponent = props => {
  return (prev, cur) => {
    const { name, properties = [] } = cur

    if (!name) {
      return prev
    }

    prev[name] = {
      ...cur,
      properties: [...commonProperties, ...properties].map(prop => {
        const property = typeof prop === 'string' ? { name: prop } : prop
        return {
          group: '通用',
          editor: 'default',
          ...props[property.name],
          ...property
        }
      })
    }
    return prev
  }
}

const reduceDatasource = props => {
  return (prev, cur) => {
    const { type, properties = [] } = cur

    if (!type) {
      return prev
    }

    prev[type] = {
      ...cur,
      properties: properties.map(prop => {
        const property = typeof prop === 'string' ? { name: prop } : prop
        return {
          editor: 'default',
          ...props[property.name],
          ...property
        }
      })
    }
    return prev
  }
}

const state = {
  properties: {},
  components: {}, // 设计器支持的组件
  datasource: {},
  functional: []
  // schema: {}
  //
  // icons: {}
}

const mutations = {
  INIT: (state, payload) => {
    const { components = [], properties = [], datasource = [] } = payload

    state.properties = properties.reduce(
      reduceProperty,
      internalProperties.reduce(reduceProperty, {})
    )
    state.components = components.reduce(
      reduceComponent(state.properties),
      html.reduce(reduceComponent(state.properties), {})
    )
    state.datasource = datasource.reduce(
      reduceDatasource(state.properties),
      internalDatasource.reduce(reduceDatasource(state.properties), {})
    )
  }
}

const actions = {
  init({ commit }, payload) {
    commit('INIT', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
