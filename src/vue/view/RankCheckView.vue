<template>
  <section class="rank-check-view">
    <div class="container">
      <h3 class="nav-title">BUTTON</h3>
      <button-selector v-model="currentButton"></button-selector>

      <div class="row row-rank">
        <div class="col">
          <h3 class="col-title">SKILLPONT</h3>
          <div class="adjusted-skillpoint">
            <span :title="`모든 패턴을 퍼펙트로 클리어했을 때의 스킬포인트가 10000이 되도록 조절하기 전의 값은 [${totalSkillpoint.toFixed(2)}] 입니다.`">
              {{ adjustedSkillpoint.toFixed(4) }}
            </span>
          </div>
        </div>
        <div class="col">
          <h3 class="col-title">YOUR RANK IS</h3>
          <div class="rank">{{ rank }}</div>
        </div>
      </div>

      <div class="progress">
        <div class="progress-bar bg-info" :style="{ width: `${adjustedSkillpoint / 10000 * 100}%` }"></div>
      </div>

      <h3 class="table-title">TOP 50</h3>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>TITLE</th>
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
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { DIFFICULTIES_LOWERCASE, RANKS } from '../../data/consts';
import { MAXIMUM_POTENTIAL_SKILLPOINT } from '../../data/computed';

import ButtonSelector from '../components/ButtonSelector';

export default {
  components: {
    ButtonSelector,
  },

  data() {
    return {
      currentButton: '6',

      ranked: [],
      totalSkillpoint: 0,
      adjustedSkillpoint: 0,
      rank: '',
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
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";

.rank-check-view {
  margin: 1rem 0;
}

.nav-title {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.row-rank {
  gap: 1rem;
  margin: 2rem 0 1rem;

  .col {
    padding: 1rem 0;
    text-align: center;
    border: 2px solid $secondary;
    border-radius: .5rem;
  }

  .col-title {
    font-size: 2rem;
  }

  .adjusted-skillpoint {
    font-size: 2.5rem;
    font-weight: bold;

    span {
      border-bottom: 1px dashed $secondary;
      cursor: help;
    }
  }

  .rank {
    font-size: 2.5rem;
    font-weight: bold;
  }
}

.table-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
