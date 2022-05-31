<template>
  <b-row class="vh-100 vw-100 row-login">
    <b-col
      class="d-flex justify-content-center align-items-center left-login"
      sm="5"
    >
      <div class="col-8">
        <h2 class="text-center mb-5 title-login">
          <strong>Faça o login</strong>
        </h2>

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
            <b-button type="button" variant="primary mt-2" block @click="login"
              ><i class="fas fa-sign-in-alt"></i> Entrar
            </b-button>
            <hr />
            <b-button
              type="button"
              variant="outline-secondary"
              block
              @click="goToRegister"
              ><i class="fas fa-user-plus"></i> Não tenho conta
            </b-button>
          </b-form-group>
        </b-form>
      </div>
    </b-col>
    <b-col sm="7" class="d-flex align-items-center d-none d-md-block">
      <img src="../assets/login.svg" class="img-fluid w-75" alt="" />
    </b-col>
  </b-row>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import ToastMixin from "@/mixins/toastMixin";
import UsersModel from "@/models/UsersModel";

export default {
  mixins: [ToastMixin],

  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
  },
  methods: {
    async login() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }
      let user = await UsersModel.params({ email: this.form.email }).get();

      if (!user || !user[0] || !user[0].email) {
        this.showToast("danger", "Error!", "Usuário e/ou senha incorretos");
        this.clearForm();
        return;
      }

      user = user[0];
      if (user.password != this.form.password) {
        this.showToast("danger", "Error!", "Usuário e/ou senha incorretos");
        this.clearForm();
        return;
      }
      localStorage.setItem('authUser', JSON.stringify(user));
      this.$router.push({name:'list'});
    },
    clearForm() {
      this.form = {
        email: "",
        password: "",
      };
    },
    // registrer() {},
    getValidation(field) {
      if (this.$v.form.$dirty === false) {
        return null;
      }
      return !this.$v.form[field].$error;
    },
    goToRegister() {
      this.$router.push({ path: "/register" });
    },
  },
};
</script>

<style>
</style>