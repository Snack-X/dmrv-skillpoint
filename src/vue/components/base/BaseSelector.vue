<template>
  <div>
    <ul class="nav nav-pills nav-fill">
      <slot></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  margin: .5rem -.25rem;

  .nav-link {
    padding: .25rem .75rem;
    margin: .25rem;
    font-weight: bold;
    border: 2px solid;
    cursor: pointer;
    transition: color .25s, background-color .25s;
  }
}
</style>
