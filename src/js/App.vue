<template>
  <div v-if="$store.state.ready">
    <h1>DJMAX RESPECT V SKILLPOINT CALCULATOR</h1>

    <hr>

    <button :class="{ 'is-active': currentView === 'score' }" @click="currentView = 'score'">SCORE INPUT</button>
    <button :class="{ 'is-active': currentView === 'rank' }" @click="currentView = 'rank'">RANK CHECK</button>

    <hr>

    <score-input-view v-if="currentView === 'score'"></score-input-view>

    <rank-check-view v-if="currentView === 'rank'"></rank-check-view>
  </div>
</template>

<script>
import ScoreInputView from './ScoreInputView';
import RankCheckView from './RankCheckView';

export default {
  components: {
    ScoreInputView,
    RankCheckView,
  },

  data() {
    return {
      currentView: 'rank',
    }
  },

  created() {
    this.$store.dispatch('init');
  },
};
</script>

<style lang="scss" scoped>
button {
  &.is-active {
    font-weight: bold;
  }
}
</style>
