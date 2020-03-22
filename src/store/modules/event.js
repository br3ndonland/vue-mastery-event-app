import EventService from '@/services/EventService.js'

export default {
  namespaced: true,
  state: {
    events: [],
    eventsTotal: 0,
    event: {},
    perPage: 3,
  },
  mutations: {
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
    },
  },
  actions: {
    async createEvent({ commit, dispatch }, event) {
      try {
        await EventService.postEvent(event)
        commit('ADD_EVENT', event)
        commit('SET_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Your event has been created!',
        }
        dispatch('notification/add', notification, { root: true })
      } catch (e) {
        const notification = {
          type: 'error',
          message: `There was a problem creating your event: ${e.message}`,
        }
        dispatch('notification/add', notification, { root: true })
        throw Error(e)
      }
    },
    async fetchEvent({ commit, getters, dispatch, state }, id) {
      if (id == state.event.id) {
        return state.event
      }
      const event = getters.getEventById(id)
      if (event) {
        commit('SET_EVENT', event)
        return event
      } else {
        try {
          let response = await EventService.getEvent(id)
          commit('SET_EVENT', response.data)
          return response.data
        } catch (e) {
          const notification = {
            type: `error`,
            message: `There was a problem fetching the event: ${e.message}`,
          }
          dispatch('notification/add', notification, { root: true })
          throw Error(e)
        }
      }
    },
    async fetchEvents({ commit, dispatch }, { perPage, page }) {
      try {
        let response = await EventService.getEvents(perPage, page)
        commit('SET_EVENTS_TOTAL', parseInt(response.headers['x-total-count']))
        commit('SET_EVENTS', response.data)
      } catch (e) {
        const notification = {
          type: 'error',
          message: `There was a problem fetching events: ${e.message}`,
        }
        dispatch('notification/add', notification, { root: true })
        throw Error(e)
      }
    },
  },
  getters: {
    getEventById: (state) => (id) => {
      return state.events.find((event) => event.id === id)
    },
  },
}
