<template>
  <section class="statistics-view">
    <div class="container">
      <h3 class="nav-title">BUTTON</h3>
      <button-selector @update="currentButton = $event"></button-selector>

      <h3 class="table-title">
        AVERAGE ACCURACY
        <p class="additional-description">
          플레이 기록이 있는 곡만 집계합니다. 레벨을 클릭하면 상세 통계를 볼 수 있습니다.
        </p>
      </h3>
      <table class="table table-average">
        <tr>
          <th>LEVEL</th>
          <td
            v-for="level in LEVELS_BASE" :key="`level-${level}`"
            class="cell-level" :class="{ 'is-selected': selectedLevel === level }"
            @click="selectedLevel = level"
          >
            {{ level }}
          </td>
        </tr>
        <tr>
          <th>RATE</th>
          <td
            v-for="level in LEVELS_BASE" :key="`average-${level}`"
            class="cell-accuracy" :class="{ 'is-selected': selectedLevel === level }"
          >
            {{ statistics[level].accuracyAverage.toFixed(2) }}%
          </td>
        </tr>
        <tr>
          <th>SKILL</th>
          <td
            v-for="level in LEVELS_BASE" :key="`skillpoint-${level}`"
            class="cell-skillpoint" :class="{ 'is-selected': selectedLevel === level }"
          >
            {{ statistics[level].skillpointAverage.toFixed(2) }}
          </td>
        </tr>
      </table>

      <h3 class="table-title">
        DETAIL STATISTICS
        <p class="additional-description">
          TITLE, LEVEL, RATE, MAX, SKILL 등을 클릭하면 정렬이 가능합니다.
        </p>
      </h3>
      <table class="table table-detail">
        <thead>
          <tr>
            <th
              class="is-sortable"
              :class="sortKey === 'title' ? [ 'is-sorted', `is-sort-${sortDescending ? 'descending' : 'ascending'}`] : []"
              @click="changeSort('title')"
            >
              TITLE
            </th>
            <th class="text-center">DIFFICULTY</th>
            <th
              class="text-center is-sortable"
              :class="sortKey === 'level' ? [ 'is-sorted', `is-sort-${sortDescending ? 'descending' : 'ascending'}`] : []"
              @click="changeSort('level')"
            >
              LEVEL
            </th>
            <th
              class="text-center is-sortable"
              :class="sortKey === 'accuracy' ? [ 'is-sorted', `is-sort-${sortDescending ? 'descending' : 'ascending'}`] : []"
              @click="changeSort('accuracy')"
            >
              RATE
            </th>
            <th
              class="text-center is-sortable"
              :class="sortKey === 'maxcombo' ? [ 'is-sorted', `is-sort-${sortDescending ? 'descending' : 'ascending'}`] : []"
              @click="changeSort('maxcombo')"
            >
              MAX
            </th>
            <th
              class="text-center is-sortable"
              :class="sortKey === 'skillpoint' ? [ 'is-sorted', `is-sort-${sortDescending ? 'descending' : 'ascending'}`] : []"
              @click="changeSort('skillpoint')"
            >
              SKILL
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in musicsSorted" :key="`${row.title}-${row.difficulty}`"
            :class="{ 'is-below-average': statistics[selectedLevel][`${sortKey}Average`] && statistics[selectedLevel][`${sortKey}Average`] > row[sortKey] }"
          >
            <td class="cell-title">{{ row.title }}</td>
            <td class="cell-difficulty text-center">{{ row.difficulty.toUpperCase() }}</td>
            <td class="cell-level text-center">{{ row.level }}</td>
            <td class="cell-accuracy text-center">{{ row.accuracy.toFixed(2) }}%</td>
            <td class="cell-maxcombo text-center">
              <div class="icon-maxcombo" :class="{ 'is-active': row.maxcombo }"></div>
            </td>
            <td class="cell-skillpoint text-center">{{ row.skillpoint.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { DIFFICULTIES_LOWERCASE, LEVELS_BASE } from '~/data/consts';
import ButtonSelector from '/vue/components/common/ButtonSelector';

export default {
  components: {
    ButtonSelector,
  },

  data() {
    return {
      currentButton: '4',

      scores: [],

      selectedLevel: null,
      statistics: {},

      sortKey: null,
      sortDescending: false,

      // descending
      sortFn: {
        title: (a, b) => b.title.localeCompare(a.title) || b.index - a.index,
        level: (a, b) => b.level.localeCompare(a.level) || b.accuracy - a.accuracy,
        accuracy: (a, b) => b.accuracy - a.accuracy || b.skillpoint - a.skillpoint,
        maxcombo: (a, b) => b.maxcombo - a.maxcombo || b.skillpoint - a.skillpoint,
        skillpoint: (a, b) => b.skillpoint - a.skillpoint || b.accuracy - a.accuracy,
      }
    };
  },

  computed: {
    LEVELS_BASE() { return LEVELS_BASE; },

    musicsSorted() {
      if (this.selectedLevel === null) return [];
      if (this.sortKey === null) return this.statistics[this.selectedLevel].musics;

      return this.statistics[this.selectedLevel].musics.slice().sort((a, b) => {
        return this.sortDescending ? this.sortFn[this.sortKey](a, b) : this.sortFn[this.sortKey](b, a);
      });
    },
  },

  watch: {
    currentButton() {
      this.calculate();
    },
  },

  created() {
    this.loadData();
    this.calculate();
  },

  methods: {
    loadData() {
      this.scores = this.$store.getters.getScores;
    },

    getAverage(arr) {
      const total = arr.reduce((a, b) => a + b, 0);
      const count = arr.length;
      return total / count;
    },

    calculate() {
      const statistics = {};

      for (const row of this.scores) {
        const music = this.$store.getters.getMusic(row.title);
        const skill = this.$store.getters.getSkill(row.title);

        for (const difficulty of DIFFICULTIES_LOWERCASE) {
          const prop = difficulty + this.currentButton;
          const level = music[prop];
          const score = row[prop];
          const skillpoint = skill[prop];
          if (!level || !score) continue;

          const levelBase = level.split('.')[0];
          if (!statistics[levelBase]) {
            statistics[levelBase] = {
              accuracyAverage: [],
              skillpointAverage: [],
              musics: [],
            };
          }

          let [accuracy, maxcombo] = score;
          accuracy = parseFloat(accuracy);

          statistics[levelBase].accuracyAverage.push(accuracy);
          statistics[levelBase].skillpointAverage.push(skillpoint);
          statistics[levelBase].musics.push({
            index: music.index, title: music.title,
            difficulty, level, accuracy, skillpoint, maxcombo,
          });
        }
      }

      for (const levelBase of LEVELS_BASE) {
        if (!statistics[levelBase]) {
          statistics[levelBase] = {
            accuracyAverage: 0,
            skillpointAverage: 0,
            musics: [],
          };

          continue;
        }

        statistics[levelBase].accuracyAverage = this.getAverage(statistics[levelBase].accuracyAverage);
        statistics[levelBase].skillpointAverage = this.getAverage(statistics[levelBase].skillpointAverage);
      }

      this.statistics = statistics;
    },

    changeSort(key) {
      if (this.sortKey === key) {
        this.sortDescending = !this.sortDescending;
      } else {
        this.sortKey = key;

        if (key === 'title' || key === 'level') {
          this.sortDescending = false;
        } else {
          this.sortDescending = true;
        }
      }

      this.sortForceUpdate += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';

.statistics-view {
  margin: 1rem 0;
}

.nav-title {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.table-title {
  position: relative;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.additional-description {
  position: absolute;
  margin: 0;
  right: 0;
  bottom: 0;
  color: $secondary;
  font-size: .75rem;
  font-weight: normal;
}

.table-average {
  th, td {
    padding: .75rem 0;
    vertical-align: middle;
  }

  th {
    padding-right: .5rem;
    text-align: right;
  }

  td {
    text-align: center;
  }

  .is-selected {
    background-color: lighten($primary, 40%);
  }

  .cell-level {
    font-weight: bold;
    cursor: pointer;
  }

  .cell-accuracy,
  .cell-skillpoint {
    font-size: .875rem;
  }
}

.table-detail {
  th, td {
    padding: .75rem .5rem;
  }

  th {
    transition: background-color .25s;
  }

  .is-sortable {
    cursor: pointer;

    &:hover {
      background-color: $gray-100;
    }
  }

  .is-sorted {
    background-color: $gray-200;

    &.is-sort-ascending::after {
      content: '↑';
    }

    &.is-sort-descending::after {
      content: '↓';
    }

    &::after {
      display: block;
      float: right;
      margin-top: .25rem;
      color: $secondary;
      font-size: .75rem;
      font-weight: normal;
    }
  }

  .is-below-average {
    td {
      background-color: lighten($danger, 45%);
    }
  }

  .cell-difficulty {
    width: 7rem;
    font-weight: bold;
  }

  .cell-level {
    width: 5rem;
  }

  .cell-accuracy {
    width: 5rem;
  }

  .cell-maxcombo {
    width: 4rem;
  }

  .cell-skillpoint {
    width: 5rem;
  }

  .icon-maxcombo {
    display: inline-block;
    vertical-align: middle;
    width: 1.5rem;
    height: 1.5rem;
    background: transparent;
    background-image: url('/images/max_combo.png');
    background-size: cover;
    opacity: .25;

    &.is-active {
      opacity: 1;
    }
  }
}
</style>
