import Vue from 'vue';
import Vuex from 'vuex';
import Loki from 'lokijs';

import * as Utils from './utils';
import { BUTTONS, DIFFICULTIES_LOWERCASE } from '../data/consts';
import { getSkillpoint } from '../data/formulas';
import MusicData from '../data/musics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ready: false,

    /** @type Loki */
    memDb: null,

    /** @type Collection */
    musicCollection: null,

    /** @type Collection */
    skillCollection: null,

    /** @type Loki */
    scoreDb: null,

    /** @type Collection */
    scoreCollection: null,
  },

  mutations: {
    initMemoryDatabase(state, db) {
      state.memDb = db;
      state.musicCollection = state.memDb.addCollection('music', {
        indices: [ 'category', 'title' ],
      });
      state.skillCollection = state.memDb.addCollection('skill');

      // array index is added to ensure original order
      state.musicCollection.insert(
        MusicData.map((music, index) => ({
          ...music,
          order: index,
        }))
      );
    },

    initScoreDatabase(state, db) {
      state.scoreDb = db;

      state.scoreCollection = state.scoreDb.addCollection('score', {
        indices: [ 'title' ],
      });

      state.scoreDb.saveDatabase();

      // populate in-memory skill collection with existing scores
      const scores = state.scoreCollection.find();

      for (const score of scores) {
        const music = state.musicCollection.findOne({ title: score.title });

        if (!music) {
          console.error(`Existing score for [${score.title}] is not found from music database`);
          continue;
        }

        const skillData = { title: score.title };

        for (const button of BUTTONS) {
          let target = 0;
          let targetDifficulty = 'nm';

          for (const diff of DIFFICULTIES_LOWERCASE) {
            const key = `${diff}${button}`;

            if (music[key] && score[key]) {
              const accuracy = parseFloat(score[key][0] || '0.00') / 100;
              const maxcombo = Boolean(score[key][1]);

              const skillpoint = getSkillpoint(button, music[key], accuracy, maxcombo) || 0;

              if (target <= skillpoint) {
                target = skillpoint;
                targetDifficulty = diff;
              }

              skillData[key] = skillpoint;
            }
          }

          if (target !== 0) {
            skillData['target' + button] = target;
            skillData['targetDifficulty' + button] = targetDifficulty;
          }
        }

        state.skillCollection.insert(skillData);
      }
    },

    setReady(state) {
      state.ready = true;
    },

    writeScore(state, { title, ...data }) {
      const existing = state.scoreCollection.findOne({ title });

      if (existing) {
        const updateData = Utils.removeReactivity(existing);

        for (const key in data) updateData[key] = data[key];

        state.scoreCollection.update(updateData);
      } else {
        state.scoreCollection.insert({ title, ...data });
      }

      state.scoreDb.saveDatabase();
    },

    writePoint(state, { title, ...data }) {
      // TODO: optimize

      const music = state.musicCollection.findOne({ title });

      const points = {};
      for (const key in data) {
        const skillpoint = getSkillpoint(key.substr(-1), music[key], parseFloat(data[key][0]) / 100, data[key][1]);
        points[key] = skillpoint;
      }

      const existing = state.skillCollection.findOne({ title });

      if (existing) {
        const updateData = {
          ...Utils.removeReactivity(existing),
          ...points,
        };

        for (const button of BUTTONS) {
          let target = 0;
          let targetDifficulty = 'nm';

          for (const diff of DIFFICULTIES_LOWERCASE) {
            const key = `${diff}${button}`;

            if (music[key] && updateData[key] && target <= updateData[key]) {
              target = updateData[key];
              targetDifficulty = diff;
            }
          }

          if (target !== 0) {
            updateData['target' + button] = target;
            insertData['targetDifficulty' + button] = targetargetDifficulty;
          }
        }

        state.skillCollection.update(updateData);
      } else {
        const insertData = { title, ...points };

        for (const button of BUTTONS) {
          let target = 0;
          let targetDifficulty = 'nm';

          for (const diff of DIFFICULTIES_LOWERCASE) {
            const key = `${diff}${button}`;

            if (music[key] && insertData[key] && target <= insertData[key]) {
              target = insertData[key];
              targetDifficulty = diff;
            }
          }

          if (target !== 0) {
            insertData['target' + button] = target;
            insertData['targetDifficulty' + button] = targetargetDifficulty;
          }
        }

        state.skillCollection.insert(insertData);
      }
    },
  },

  actions: {
    init({ commit }) {
      const memDatabase = new Loki('temp.db');
      commit('initMemoryDatabase', memDatabase);

      const scoreDatabase = new Loki('score.db', {
        autoload: true,
        autoloadCallback: () => {
          commit('initScoreDatabase', scoreDatabase);
          commit('setReady');
        },
        adapter: new Loki.LokiLocalStorageAdapter(),
      });
    },

    saveScore({ commit }, title, data) {
      commit('writeScore', title, data);
      commit('writePoint', title, data);
    },
  },

  getters: {
    getMusicsByCategory: state => category => {
      return state.musicCollection.chain()
        .find({ category })
        .simplesort('order')
        .data();
    },

    getScore: state => title => {
      return state.scoreCollection.findOne({ title });
    },

    getSkill: state => title => {
      return state.skillCollection.findOne({ title });
    },

    getSkillTop50: state => button => {
      const prop = 'target' + button;

      return state.skillCollection.chain()
        .find({ [prop]: { $exists: true } })
        .find({ [prop]: { $gt: 0 } })
        .simplesort(prop, { desc: true })
        .limit(50)
        .data();
    },
  }
})
