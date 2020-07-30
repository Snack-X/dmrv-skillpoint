<template>
  <section>
    <button
      v-for="button in BUTTONS" :key="`button-${button}`"
      :class="{ 'is-active': currentButton === button }"
      @click="currentButton = button"
    >
      {{ button }} BUTTONS
    </button>
    <br>
    <button
      v-for="category in CATEGORIES" :key="`category-${category}`"
      :class="{ 'is-active': currentCategory === category }"
      @click="currentCategory = category"
    >
      {{ category }}
    </button>

    <hr>

    <table>
      <thead>
        <tr>
          <th rowspan="2">CATEGORY</th>
          <th rowspan="2">MUSIC</th>
          <th colspan="4">NM</th>
          <th colspan="4">HD</th>
          <th colspan="4">MX</th>
          <th colspan="4">SC</th>
          <th rowspan="2" colspan="4">TARGET</th>
        </tr>
        <tr>
          <th>LV</th>
          <th>ACCURACY</th>
          <th>MAX</th>
          <th>SKILL</th>

          <th>LV</th>
          <th>ACCURACY</th>
          <th>MAX</th>
          <th>SKILL</th>

          <th>LV</th>
          <th>ACCURACY</th>
          <th>MAX</th>
          <th>SKILL</th>

          <th>LV</th>
          <th>ACCURACY</th>
          <th>MAX</th>
          <th>SKILL</th>
        </tr>
      </thead>
      <tbody>
        <!-- kinda hack to reload data from database everytime button changes -->
        <music-row
          v-for="music in musics" :key="music.title + currentButton"
          :music="music" :button="currentButton"
        />
      </tbody>
    </table>
  </section>
</template>

<script>
import { BUTTONS, CATEGORIES } from '../data/consts';

import MusicRow from './MusicRow';

export default {
  components: { MusicRow },

  data() {
    return {
      currentButton: '6',
      currentCategory: 'RESPECT',

      musics: [],

      BUTTONS,
      CATEGORIES,
    }
  },

  watch: {
    currentCategory() { this.loadMusics(); }
  },

  created() {
    this.loadMusics();
  },

  methods: {
    loadMusics() {
      this.musics = this.$store.getters.getMusicsByCategory(this.currentCategory);
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  &.is-active {
    font-weight: bold;
  }
}

table {
  border-collapse: collapse;

  ::v-deep {
    th, td {
      border: 1px solid #888888;
    }
  }
}
</style>
