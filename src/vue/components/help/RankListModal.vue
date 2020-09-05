<template>
  <div class="modal fade">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">랭크 목록</h5>
          <button type="button" class="close" data-dismiss="modal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <button-selector v-model="currentButton"></button-selector>

          <table class="table table-sm rank-table">
            <thead>
              <tr>
                <th class="rank-header">랭크</th>
                <th class="skill-header">요구치</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in RANKS[currentButton]" :key="row.name">
                <td class="rank-cell">{{ row.name }}</td>
                <td class="skill-cell">{{ row.requires }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RANKS } from '/data/consts';
import ButtonSelector from '/vue/components/common/ButtonSelector';

export default {
  components: { ButtonSelector },

  data() {
    return {
      currentButton: '4',
    };
  },

  computed: {
    RANKS() { return RANKS; },
    ranksList() { return this.RANKS[this.currentButton]; },
  },
};
</script>

<style lang="scss" scoped>
.rank-table {
  margin: 1rem auto 0;
  width: 50%;

  th, td {
    text-align: center;
  }
}

.skill-cell {
  width: 5rem;
}
</style>
