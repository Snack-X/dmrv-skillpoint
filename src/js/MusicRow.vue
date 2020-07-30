<template>
  <tr>
    <td>{{ music.category }}</td>
    <td>{{ music.title }}</td>

    <template v-if="level.nm">
      <td>{{ level.nm }}</td>
      <td><input v-model="accuracy.nm" type="text">%</td>
      <td><input v-model="maxcombo.nm" type="checkbox"></td>
      <td>{{ skillpoint.nm.toFixed(2) }}</td>
    </template>
    <template v-else>
      <td colspan="4">
    </template>

    <template v-if="level.hd">
      <td>{{ level.hd }}</td>
      <td><input v-model="accuracy.hd" type="text">%</td>
      <td><input v-model="maxcombo.hd" type="checkbox"></td>
      <td>{{ skillpoint.hd.toFixed(2) }}</td>
    </template>
    <template v-else>
      <td colspan="4">
    </template>

    <template v-if="level.mx">
      <td>{{ level.mx }}</td>
      <td><input v-model="accuracy.mx" type="text">%</td>
      <td><input v-model="maxcombo.mx" type="checkbox"></td>
      <td>{{ skillpoint.mx.toFixed(2) }}</td>
    </template>
    <template v-else>
      <td colspan="4">
    </template>

    <template v-if="level.sc">
      <td>{{ level.sc }}</td>
      <td><input v-model="accuracy.sc" type="text">%</td>
      <td><input v-model="maxcombo.sc" type="checkbox"></td>
      <td>{{ skillpoint.sc.toFixed(2) }}</td>
    </template>
    <template v-else>
      <td colspan="4">
    </template>

    <td>{{ target.toFixed(2) }}</td>
  </tr>
</template>

<script>
import { DIFFICULTIES_LOWERCASE } from '../data/consts';

export default {
  props: {
    music: {
      type: Object,
      required: true,
    },

    button: {
      type: String,
      default: '4',
    },
  },

  data() {
    const data = {
      accuracy: {
        nm: '0.00',
        hd: '0.00',
        mx: '0.00',
        sc: '0.00',
      },
      maxcombo: {
        nm: false,
        hd: false,
        mx: false,
        sc: false,
      },
      skillpoint: {
        nm: 0,
        hd: 0,
        mx: 0,
        sc: 0,
      },
      target: 0,
    };

    const dbScore = this.$store.getters.getScore(this.music.title);
    if (!dbScore) return data;

    const dbSkill = this.$store.getters.getSkill(this.music.title);

    for (const diff of DIFFICULTIES_LOWERCASE) {
      const [ accuracy, maxcombo ] = dbScore[diff + this.button] || [ '0.00', false ];
      data.accuracy[diff] = accuracy || '0.00';
      data.maxcombo[diff] = Boolean(maxcombo);

      data.skillpoint[diff] = dbSkill[diff + this.button] || 0;
      data.target = dbSkill['target' + this.button] || 0;
    }

    return data;
  },

  watch: {
    // button() { this.loadFromDatabase(); },

    accuracy: {
      deep: true,
      handler: function () { this.saveToDatabase(); },
    },

    maxcombo: {
      deep: true,
      handler: function () { this.saveToDatabase(); },
    },
  },

  computed: {
    level() {
      return {
        nm: this.music['nm' + this.button],
        hd: this.music['hd' + this.button],
        mx: this.music['mx' + this.button],
        sc: this.music['sc' + this.button],
      };
    },
  },

  created() {
  },

  methods: {
    saveToDatabase() {
      const data = {
        title: this.music.title,
      };

      for (const diff of DIFFICULTIES_LOWERCASE) {
        data[diff + this.button] = [ this.accuracy[diff], this.maxcombo[diff] ];
      }

      this.$store.dispatch('saveScore', data);
      this.getSkillpointFromDatabase();
    },

    getSkillpointFromDatabase() {
      const dbSkill = this.$store.getters.getSkill(this.music.title);
      if (!dbSkill) return;

      for (const diff of DIFFICULTIES_LOWERCASE) {
        this.skillpoint[diff] = dbSkill[diff + this.button] || 0;
        this.target = dbSkill['target' + this.button] || 0;
      }
    },
  },
};
</script>

<style>
input[type=text] {
  width: 48px;
}
</style>
