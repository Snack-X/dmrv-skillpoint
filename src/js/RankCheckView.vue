<template>
  <section>
    <button
      v-for="button in BUTTONS" :key="`button-${button}`"
      :class="{ 'is-active': currentButton === button }"
      @click="currentButton = button"
    >
      {{ button }} BUTTONS
    </button>

    <hr>

    Total Skillpoint - <b>{{ totalSkillpoint.toFixed(4) }}</b><br>
    Adjusted Skillpoint - <b>{{ adjustedSkillpoint.toFixed(4) }}</b><br><br>
    Rank - <b>{{ rank }}</b><br>

    <hr>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>MUSIC</th>
          <th>DIFFICULTY</th>
          <th>ACCURACY</th>
          <th>SKILLPOINT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in ranked" :key="row.title">
          <td>{{ idx + 1 }}</td>
          <td>{{ row.title }}</td>
          <td>{{ row.difficulty.toUpperCase() }}</td>
          <td>{{ row.accuracy }}%</td>
          <td>{{ row.skillpoint.toFixed(2) }}</td>
        </tr>
        <!-- <music-row v-for="music in musics" :key="music.title" :music="music" :button="currentButton" /> -->
      </tbody>
    </table>
  </section>
</template>

<script>
import { BUTTONS, DIFFICULTIES_LOWERCASE, RANKS } from '../data/consts';
import { MAXIMUM_POTENTIAL_SKILLPOINT } from '../data/computed';

export default {
  data() {
    return {
      currentButton: '6',

      ranked: [],
      totalSkillpoint: 0,
      adjustedSkillpoint: 0,
      rank: '',

      BUTTONS,
    }
  },

  watch: {
    currentButton() {
      this.reset();
      this.loadData();
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    reset() {
      this.ranked = [];
      this.totalSkillpoint = 0;
      this.adjustedSkillpoint = 0;
      this.rank = '';
    },

    loadData() {
      const top50 = this.$store.getters.getSkillTop50(this.currentButton);
      const scores = {};

      let total = 0;

      for (const row of top50) {
        const title = row.title;
        const score = this.$store.getters.getScore(title);

        const rankedRow = {
          title,
          difficulty: row['targetDifficulty' + this.currentButton],
          skillpoint: row['target' + this.currentButton],
        };

        rankedRow.accuracy = score[rankedRow.difficulty + this.currentButton][0];
        this.ranked.push(rankedRow);

        total += rankedRow.skillpoint;
      }

      const adjusted = total / MAXIMUM_POTENTIAL_SKILLPOINT[this.currentButton] * 10000;

      this.totalSkillpoint = total;
      this.adjustedSkillpoint = adjusted;

      for (const rank of RANKS[this.currentButton]) {
        if (rank.requires <= adjusted) {
          this.rank = rank.name;
          break;
        }
      }
    },

    getTargetDifficulty(row) {
      return row['targetDifficulty' + this.currentButton];
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
