import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";

export const MUTATIONS = {
  SET_FEEDS: 'SET_FEEDS',
  SET_FOLDERS: 'SET_FOLDERS'
}

export const ACTIONS = {
  FETCH_FEEDS: 'FETCH_FEEDS',
  FETCH_FOLDERS: 'FETCH_FOLDERS'
}

const state = {
  feeds: [],
  folders: [],
  items: []
}

const mutations = {
  [MUTATIONS.SET_FEEDS] (state, feeds) {
    state.feeds = feeds;
  },
  [MUTATIONS.SET_FOLDERS] (state, folders) {
    state.folders = folders;
  }
}

const actions = {
  async [ACTIONS.FETCH_FEEDS] ({ commit }) {
    const feeds = await axios.get(
      generateUrl("/apps/news/feeds")
    );

    commit(MUTATIONS.SET_FEEDS, feeds.data.feeds);
  },
  async [ACTIONS.FETCH_FOLDERS] ({ commit }) {
    const folders = await axios.get(
      generateUrl("/apps/news/folders")
    );

    commit(MUTATIONS.SET_FOLDERS, folders.data.folders);
  }
}

const getters = {
  feeds (state) {
    return state.feeds;
  },
  folders (state) {
    return state.folders;
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
