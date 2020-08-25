<template>
  <div>
    <ul class="nav nav-pills nav-fill">
      <slot></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  gap: .5rem;
  margin: .5rem 0;

  .nav-link {
    padding: .25rem 1rem;
    font-weight: bold;
    border: 2px solid;
    cursor: pointer;
    transition: color .25s, background-color .25s;
  }
}
</style>
