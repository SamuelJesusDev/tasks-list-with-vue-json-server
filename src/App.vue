<template>
  <div id="app mt-0">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/list" >ToDo List</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
           <b-nav-item to="/list">Tarefas</b-nav-item>
           <b-nav-item to="/form">Formulário</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {
    
  },
};
</script>

<style>
/* efeito transição de tela */
.fade-enter-active, .fade-leave-active{
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter, .fade-leave{
  opacity:0;
}
</style>
