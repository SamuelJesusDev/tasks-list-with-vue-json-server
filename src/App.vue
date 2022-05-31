<template>
  <div id="app mt-0">
    <b-navbar toggleable="lg" type="dark" variant="info" v-if="notIsPageLogin">
      <b-navbar-brand to="/login" >ToDo List</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
           <b-nav-item to="/list">Tarefas</b-nav-item>
           <b-nav-item to="/form">Formulário</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
       <b-navbar-nav right>
      <b-nav-item
      @click="logout"
      v-b-tooltip.hover
      title="Sair">
        <i class="fas fa-sign-out-alt"></i>
      </b-nav-item>
    </b-navbar-nav>
    </b-navbar>
   
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: "App",

  computed:{
    notIsPageLogin(){
      return this.$route.name !=="login" && this.$route.name !=="register";
    }
  },
 methods:{ logout(){
    localStorage.removeItem('authUser');
  this.$router.push({path: '/login'});
  }}
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
