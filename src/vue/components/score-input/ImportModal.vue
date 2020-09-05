<template>
  <base-modal
    class="import-modal" :value="value" title="Data Bulk Import"
    @input="$emit('input', $event)" @show="onShow"
  >
    <template #body>
      <p class="description">스킬포인트 데이터를 가져옵니다.</p>
      <ul>
        <li>
          <h6>Google Spreadsheet 스킬포인트 데이터 가져오기</h6>
          <p class="description">
            <strong>{{ currentButton }}버튼</strong> 시트의 <strong>A열 ~ R열</strong>을 선택해서 복사한 뒤 아래에 붙여넣습니다.
          </p>
        </li>
        <li>
          <h6>웹버전 데이터 가져오기</h6>
          <p class="description">
            웹버전 스킬포인트 트래커의 <strong>EXPORT</strong> 기능을 통해 내보낸 데이터를 아래에 붙여넣습니다.
          </p>
        </li>
      </ul>

      <textarea v-model="inputData" class="form-control"></textarea>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('input', false)">취소</button>
      <button type="button" class="btn btn-primary" @click="importData">가져오기</button>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from '/vue/components/base/BaseModal';
import { DIFFICULTIES_LOWERCASE } from '/data/consts';

export default {
  components: { BaseModal },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    currentButton: {
      type: String,
      default: '4',
    },
  },

  data() {
    return {
      inputData: '',
    };
  },

  methods: {
    onShow() {
      this.inputData = '';
    },

    importData() {
      const lines = this.inputData.split('\n');

      // Minimal sanity check
      const expectedFirstLine = [
        'VERSION', 'MUSIC',
        'NM', 'Accuracy', 'MAX', 'SP',
        'HD', 'Accuracy', 'MAX', 'SP',
        'MX', 'Accuracy', 'MAX', 'SP',
        'SC', 'Accuracy', 'MAX', 'SP',
      ].join('\t');

      if (!lines[0].startsWith(expectedFirstLine)) {
        alert('데이터 형식이 올바르지 않습니다. 데이터를 정확히 복사했는지 확인해주세요.');
        return;
      }

      const cells = lines.map(line => line.split('\t'));
      const data = [];
      for (let i = 1; i < cells.length; i++) {
        const line = cells[i];
        if (line[0].trim() === '') continue;

        const title = line[1];
        const music = this.$store.getters.getMusic(title);
        if (!music) {
          alert(`곡명 [${title}]을 찾을 수 없습니다.`);
          return;
        }

        const row = { title };

        for (let di = 0; di < DIFFICULTIES_LOWERCASE.length; di++) {
          const diff = DIFFICULTIES_LOWERCASE[di];
          const curDiff = diff + this.currentButton;

          const inputLevel = line[di * 4 + 2];
          const inputAcc = line[di * 4 + 3].slice(0, -1);
          const inputMax = line[di * 4 + 4] !== '';

          if (inputLevel !== '-' && !music[curDiff]) {
            alert(`곡 [${title}]의 ${this.currentButton}버튼에는 ${diff.toUpperCase()} 패턴이 존재하지 않습니다. 다른 버튼의 데이터를 가져오고 있는게 아닌지 확인해주세요.`);
            return;
          }

          if (inputAcc) {
            row[curDiff] = [inputAcc, inputMax];
          }
        }

        data.push(row);
      }

      const confirmAnswer = confirm(`총 ${data.length}곡의 데이터를 확인했습니다. 기존 데이터 위에 새로운 데이터를 덮어쓸까요? 덮어쓸 경우 되돌릴 수 없습니다.`);
      if (!confirmAnswer) return;

      for (const row of data) {
        this.$store.dispatch('saveScore', row);
      }

      alert('데이터를 불러왔습니다.');
      this.$emit('imported');
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.import-modal {
  textarea {
    height: 16rem !important;
    font-size: .5rem;
  }
}

h6 {
  font-weight: bold;
}

.description {
  font-size: .875rem;;
}
</style>
