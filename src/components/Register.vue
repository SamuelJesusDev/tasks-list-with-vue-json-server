<template>
  <b-row class="vh-100 vw-100 row-login">
    <b-col sm="7" class="d-flex align-items-center">
      <img src="../assets/register.svg" class="img-fluid w-75 d-none d-md-block" alt="" />
    </b-col>
    <b-col
      class="d-flex justify-content-center align-items-center left-login"
      sm="5"
    >
      <div class="col-8">
        <h2 class="text-center mb-5 title-login">
          <strong>Faça o Cadastro</strong>
        </h2>
        <b-form>
          <b-form-group label="Nome" label-for="name"
            ><b-form-input
              id="name"
              type="text"
              placeholder="João Silva"
              autocomplete="off"
              v-model.trim="$v.form.name.$model"
              :state="getValidation('name')"
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-form>
          <b-form-group label="E-mail" label-for="email"
            ><b-form-input
              id="email"
              type="email"
              placeholder="joãosilva@email.com"
              autocomplete="off"
              v-model.trim="$v.form.email.$model"
              :state="getValidation('email')"
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-form>
          <b-form-group label-for="password">
            <label class="d-flex justify-content-between"
              >Senha <a href="#" class="small">Esqueceu sua senha?</a></label
            >
            <b-form-input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              autocomplete="off"
              v-model.trim="$v.form.password.$model"
              :state="getValidation('password')"
            ></b-form-input>
          </b-form-group>
          <!----------------------------------------------------------->
          <b-form-group label-for="confirmPassword">
            <label class="d-flex justify-content-between">
              Confirme sua senha</label
            >
            <b-form-input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              autocomplete="off"
              v-model.trim="$v.form.confirmPassword.$model"
              :state="getValidation('confirmPassword')"
            ></b-form-input>
          </b-form-group>
          <b-button type="button" variant="primary mt-2" block @click="register"
            ><i class="fas fa-sign-in-alt"></i> Cadastrar
          </b-button>
          <hr />
          <b-button
            type="button"
            variant="outline-secondary"
            block
            @click="goToLogin"
            ><i class="fas fa-arrow-left"></i> Voltar
          </b-button>
        </b-form>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import UsersModel from "@/models/UsersModel";
import ToastMixin from "@/mixins/toastMixin.js";

export default {
  mixins: [ToastMixin],
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
    register() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }
      const user = new UsersModel(this.form);
      user.save();
      this.showToast("success", "Sucesso!", "Usuário cadastrado com sucesso");
      this.goToLogin();
    },
    // registrer() {},
    getValidation(field) {
      if (this.$v.form.$dirty === false) {
        return null;
      }
      return !this.$v.form[field].$error;
    },
    goToLogin() {
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style>
</style>