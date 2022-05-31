<template>
  <div class="container mt-2">
    <b-form>
      <b-form-group label="Titulo" label-for="subject">
        <!-- trim remove os espaços em brancos no começe e no fim de uma string ...($v.form.subject.$model) usado Vuelidate-->
      <b-form-input id="subject" v-model.trim="$v.form.subject.$model" :state="getValidation" aria-describedby="subject-feedback" type="text" palceholder="..." outocomplete="off" required></b-form-input>
      <b-form-invalid-feedback id="subject-feedback">Campo obrigatório</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Descrição" label-for="description">
      <b-form-textarea id="description" v-model="form.description" type="text" palceholder="..." outocomplete="off"></b-form-textarea>
      </b-form-group>
      <b-button variant="outline-primary" @click="saveTask" :disabled="!getValidation">Salvar</b-button>
    </b-form>
  </div>
</template>

<script>
import ToastMixin from '@/mixins/toastMixin';
import {required, minLength} from "vuelidate/lib/validators";
import TasksModel from "@/models/TasksModel";
export default {
 mixins:[ToastMixin],

  data(){
    return{
      form:{
        subject:'',
        description:''
      },
      methodSave:'new'
    }
  },
  // fazer a validação do subject//
  validations:{
    form:{
      subject:{
        required,
        minLength: minLength(3)
      }
    }
  },
 async created(){
    if(this.$route.params.index === 0 || this.$route.params.index !== undefined){
      this.methodSave ="update";
      this.form= await TasksModel.find(this.$route.params.index);

  //---------localStorage---------------------------------------------------
  //     let tasks = JSON.parse(localStorage.getItem("tasks"));
  // //------the form vai receber na possição que a pessoa informou------------------------------------------------------------------------------------ //
  //     this.form = tasks[this.$route.params.index]
    }
  },
  methods:{
  // ------------add items on localStorage---------------------------------------------------------------------------------------------------------- //
    saveTask(){
  //--------update items para nao duplicar---------------------------------------------------------------------------------------------------------- //
      if(this.methodSave ==="update"){
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[this.$route.params.index] = this.form;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        this.form.save();

        this.showToast("success", "Sucesso!", "Tarefa atualizada com sucesso");
        this.$router.push({name: "list"});
        return
      }
//---------------localStorage---------------------------------------------------------
// ------------save items on localstorege end return /list---------------------------------------------------------------------------------------------- //
      // let tasks =(localStorage.getItem("tasks")) ? JSON.parse(localStorage.getItem("tasks")) : [];
      // tasks.push(this.form);
      // localStorage.setItem("tasks", JSON.stringify(tasks));

//--------------------JSON-SERVER------------------------------------------------------

      const task = new TasksModel(this.form);
      task.save();

      this.showToast("success", "Sucesso!", "Tarefa Criada com sucesso");
// -----------rota que vai ser redirecionado após ser colocado no localStorage--------------------------------------------------------------------------- //
      this.$router.push({name: "list"});
    }
  },
  // exemplo(){
  //       let task = (localStorage.getItem("task")) ? JSON.parse(localStorage.getItem("task")) : [];
  //       task.push(this.form);
  //       localStorage.setItem("task", JSON.stringify(task));
  //       this.$router.push({name: "list"});
  //     },

  computed:{
    getValidation(){
 //-------------- $dirty vai indicar q o campo ainda nao foi mexido---------------------------------------------------------
      if(this.$v.form.subject.$dirty === false){
        return null;
      }
      return !this.$v.form.subject.$error;
    }
  }

}
</script>

<style>

</style>