import EventService from '@/services/EventService.js'

export const namespaced = true

export const state = {
  events: [],
  eventsTotal: 0,
  event: {}
}

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENTS_TOTAL(state, eventsTotal) {
    state.eventsTotal = eventsTotal
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  async createEvent({ commit }, event) {
    await EventService.postEvent(event)
    commit('ADD_EVENT', event)
  },
  async fetchEvent({ commit, getters }, id) {
    const event = getters.getEventById(id)
    if (event) {
      commit('SET_EVENT', event)
    } else {
      try {
        let response = await EventService.getEvent(id)
        commit('SET_EVENT', response.data)
      } catch (e) {
        throw Error(e)
      }
    }
  },
  async fetchEvents({ commit }, { perPage, page }) {
    try {
      let response = await EventService.getEvents(perPage, page)
      commit('SET_EVENTS_TOTAL', parseInt(response.headers['x-total-count']))
      commit('SET_EVENTS', response.data)
    } catch (e) {
      throw Error(e)
    }
  }
}

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id)
  }
}
