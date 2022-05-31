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
      <b-form-group label="Status" label-for="status">
      <b-form-select id="status" v-model="form.status" :options="optionsList"></b-form-select>
      </b-form-group>

      <b-form-group label="Data de vencimento" label-for="dateOverdue">
      <b-form-datepicker id="dateOverdue" v-model="form.dateOverdue" label-no-date-selected ="Selecione uma data" :min="getToday()"></b-form-datepicker>
      </b-form-group>
      <b-button variant="outline-primary" @click="saveTask"><i class="fa-solid fa-save"></i> Salvar</b-button>
    </b-form>
  </div>
</template>

<script>
import ToastMixin from '@/mixins/toastMixin';
import {required, minLength} from "vuelidate/lib/validators";
import TasksModel from "@/models/TasksModel";
import Status from "@/valueObjects/status.js"
export default {
 mixins:[ToastMixin],

  data(){
    return{
      form:{
        subject:'',
        description:'',
        status: Status.OPEN,
        dateOverdue:'',
        userId:JSON.parse(localStorage.getItem('authUser'))
      },
      methodSave:'new',
      optionsList:[
        {
          value: Status.OPEN,
          text: 'Aberto'
        },
         {
          value: Status.FINISHED,
          text: 'Concluido'
        },
         {
          value: Status.ARCHIVED,
          text: 'Arquivado'
        }
      ]
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
    }
  },
  methods:{
  // ------------add items on localStorage----------------------------------------------------------------------------------
    saveTask(){
  //--------update items para nao duplicar----------------------------------------------------------------------------------
      this.$v.$touch();
      if(this.$v.error) return;

      if(this.methodSave ==="update"){
        this.form.save();

        this.showToast("success", "Sucesso!", "Tarefa atualizada com sucesso");
        this.$router.push({name: "list"});
        return
      }
      const task = new TasksModel(this.form);
      task.save();
      this.showToast("success", "Sucesso!", "Tarefa Criada com sucesso");
// -----------rota que vai ser redirecionado após ser colocado no localStorage----------------------------------------------
      this.$router.push({name: "list"});
    },
    getToday(){
      return new Date().toISOString().split("T")[0];
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