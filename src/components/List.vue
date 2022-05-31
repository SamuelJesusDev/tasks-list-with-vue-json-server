<template>
  
  <div class="container my-2">
    <b-form inline class="mb-2">
      <b-form-input
        v-model="filter.subject"
        id="subject"
        placeholder="Ex: lavar carro"
        class="mr-2"
        autocomplete="off"
      ></b-form-input>
      <b-form-select
        v-model="filter.status"
        :options="optionsList"
        class="mr-2"
      ></b-form-select>
      <b-button variant="outline-secondary" @click="filterTasks" v-b-tooltip.hover title="Buscar"
        ><i class="fa-solid fa-search"></i></b-button
      >
      <b-button variant="outline-secondary" class="ml-2" @click="clearFilter" v-b-tooltip.hover title="Limpar filtro"
        ><i class="fa-solid fa-times"></i></b-button
      >
    </b-form>
    <template v-if="isLoading">
      <div class="loading-spin d-flex align-items-center justify-content-center">
        <b-spinner style="width: 5rem; height: 5rem;"></b-spinner>
      </div>
    </template>
    <template v-if="!isTasksEmpty && !isLoading">
      <div v-for="task in tasks" :key="task.id">
        <b-card class="mt-2" :class="{ 'finished-task': isFinished(task) }">
          <b-card-text>
            <div class="d-flex justify-content-between">
              <b-card-title>{{ task.subject }}</b-card-title>
              <span>
                <b-badge
                  :variant="variantOverdue(task.dateOverdue, task.status)"
                  >{{ overduePresenter(task.dateOverdue) }}</b-badge
                >
              </span>
            </div>
            {{ task.description }}
          </b-card-text>
          <b-button
            variant="outline-secondary mr-2"
            @click="updateStatus(task.id, status.FINISHED)" v-b-tooltip.hover title="Concluir"
            ><i class="fa-solid fa-check"></i></b-button
          >
          <b-button
            variant="outline-secondary mr-2"
            @click="updateStatus(task.id, status.ARCHIVED)" v-b-tooltip.hover title="Arquivar"
            ><i class="fa-solid fa-archive"></i></b-button
          >
          <b-button variant="outline-secondary mr-2" @click="edit(task.id)" v-b-tooltip.hover title="Editar"
            ><i class="fa-solid fa-edit"></i></b-button
          >
          <b-button variant="outline-danger" @click="remove(task.id)" v-b-tooltip.hover title="Excluir"
            ><i class="fa-solid fa-times"></i></b-button
          >
        </b-card>
      </div>
    </template>
    <template v-if="isTasksEmpty && !isLoading">
      <div class="d-flex flex-column align-items-center justify-content-center">
        <div class="mt-5">
          <img src="../assets/emp.svg" class="img-fluid w-75" alt="">
        </div>
        <b-button variant="outline-secondary mt-3" @click="redirectToform"
          >Criar Tarefa</b-button
        >
      </div>
    </template>

    <b-modal ref="modalRemove" hide-footer title="Exclusão de tarafa">
      <div class="d-block text-center">
        Deseja realmente excluir essa tarefa? {{ taskSelected.subject }}
      </div>
      <div class="mt-3 d-flex justify-content-end">
        <b-button variant="outline-secondary mr-2" @click="hideModal"
          >Cancelar</b-button
        >
        <b-button variant="outline-danger" @click="ConfirmRemoveTask(tasks)"
          >Excluir</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import TasksModel from "@/models/TasksModel";
import Status from "@/valueObjects/status";
import ToastMixin from "@/mixins/toastMixin";
export default {
  mixins: [ToastMixin],
  data() {
    return {
      tasks: [],
      taskSelected: [],
      status: Status,
      filter: { subject: null, status: null },
      optionsList: [
        { value: null, text: "Selecione algum status" },
        { value: Status.OPEN, text: "Aberto" },
        { value: Status.FINISHED, text: "Concluido" },
        { value: Status.ARCHIVED, text: "Arquivado" },
      ],
      isLoading: false,
      statusList:[Status.OPEN, Status.FINISHED],
    };
  },
  //- assism q o componente for criado vai buscar todas as tarefas do localStorage/ou banco de dados e mostrar na tela----------
  async created() {
    //---------------async await para aguardar a resposta da api------------------------------------------------
    this.tasks = await this.getTasks();
  },
  methods: {
    //---------redirect to the /form com a key------------------------------------------------------------------
    edit(index) {
      this.$router.push({ name: "form", params: { index } });
    },
    //--------- selecionando items para remover-----------------------------------------------------------------
    async remove(index) {
      this.taskSelected = await TasksModel.find(index);
      this.$refs.modalRemove.show();
    },
    hideModal() {
      this.$refs.modalRemove.hide();
    },
    //-----------confirm remove items on task-------------------------------------------------------------------
    async ConfirmRemoveTask() {
      this.taskSelected.delete();
      this.tasks =  await this.getTasks();
      this.hideModal();
    },
    async updateStatus(index, status) {
      let task = await TasksModel.find(index);
      task.status = status;
      await task.save();

      this.tasks = await this.getTasks();
      this.showToast(
        "success",
        "Sucesso!",
        "Status da Tarefa atualizado com sucesso"
      );
    },
    isFinished(task) {
      if (task.status === this.status.FINISHED) {
        return true;
      }
    },
    redirectToform() {
      this.$router.push({ path: "/form" });
    },
    async filterTasks() {
      let filter = { ...this.filter };
      filter = this.clean(filter);
      filter.userId = JSON.parse(localStorage.getItem('authUser')).id;
      this.tasks = await TasksModel.params(filter).get();
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
      return obj;
    },
    async clearFilter() {
      (this.filter = {
        subject: null,
        status: null,
      }),
        this.tasks = await this.getTasks();
    },
    overduePresenter(dateOverdue) {
      if (!dateOverdue) {
        return;
      }
      //2021-08-26 [2021, 08, 26]
      //26/08/2021
      return dateOverdue.split("-").reverse().join("/");
    },
    variantOverdue(dateOverdue, taskStatus) {
      if (!dateOverdue) {
        return "light";
      }
      if (taskStatus === this.status.FINISHED) {
        return "success";
      }

      let dateNow = new Date().toISOString().split("T")[0];
      if (dateOverdue === dateNow) {
        return "warning";
      }
      if (dateOverdue < dateNow) {
        return "danger";
      }
      return "light";
    },
    async getTasks(){
      this.isLoading = true;
      let self = this;
      setTimeout(function(){self.isLoading = false}, 1000);
      return await TasksModel
      .params({userId: JSON.parse(localStorage.getItem('authUser')).id,
      status: this.statusList
      })
      .get();
    },
  //   mounted() {
  //   api.get("/users/random_user").then((response) => {
  //     this.users = response.data;
  //   });
  // },
  },
  //....... verificar tela está vazia/ array..................................................................
  computed: {
    isTasksEmpty() {
      return this.tasks.length === 0;
    },
  },
};
</script>

<style>
.loading-spin{
  height: 65vh;
}
.finished-task {
  opacity: 0.7;
}
.finished-task > .card-body > h4,
.finished-task > .card-body > p {
  text-decoration: line-through;
}
</style>