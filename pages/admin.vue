<!-- pages/admin.vue -->
<template>
    <v-container>
      <h1>Espace Admin</h1>
  
      <!-- 1) Ajouter un nouvel admin -->
      <v-card class="pa-4 mb-6">
        <h2>Créer un compte administrateur</h2>
        <v-form @submit.prevent="addAdmin">
          <v-text-field v-model="newLogin" label="Login" required />
          <v-text-field v-model="newPass"  label="Mot de passe" type="password" required />
          <v-btn type="submit" color="primary">Créer</v-btn>
        </v-form>
      </v-card>
  
      <!-- 2) Gestion des forums -->
      <v-card class="pa-4">
        <h2>Forums existants</h2>
        <v-data-table
          :items="forums"
          :headers="[{ title:'ID', value:'id' },{ title:'Nom', value:'nom' }]"
          class="mb-4"
        >
          <template #item.actions="{ item }">
            <v-text-field
              v-model="item.nom"
              @blur="renameForum(item)"
              dense hide-details
            />
            <v-btn icon color="error" @click="deleteForum(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <div class="d-flex">
          <v-text-field v-model="newForum" label="Nouveau forum" />
          <v-btn color="primary" @click="createForum">Créer</v-btn>
        </div>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter }      from 'vue-router'
  import { useFetch }       from '#imports'
  import { useAuthStore }   from '~/stores/authStore'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  // accès réservé aux admin
  if (!auth.user?.role || auth.user.role !== 'admin') {
    router.replace('/')  // ou navigateTo()
  }
  
  // états de la page
  const forums   = ref<{id:number,nom:string}[]>([])
  const newForum = ref('')
  const newLogin = ref('')
  const newPass  = ref('')
  
  // récupère la liste
  async function loadForums() {
    const { data } = await useFetch('/api/forums')
    forums.value = data.value
  }
  
  onMounted(() => {
    auth.initFromStorage()
    loadForums()
  })
  
  // appels API
  async function createForum() {
    await $fetch('/api/forums', {
      method: 'POST',
      body: { nom: newForum.value }
    })
    newForum.value = ''
    loadForums()
  }
  async function renameForum(item:{id:number,nom:string}) {
    await $fetch(`/api/forums/${item.id}`, {
      method: 'PATCH',
      body: { nom: item.nom }
    })
    loadForums()
  }
  async function deleteForum(id:number) {
    if (!confirm('Supprimer ce forum ?')) return
    await $fetch(`/api/forums/${id}`, { method: 'DELETE' })
    loadForums()
  }
  async function addAdmin() {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: { login:newLogin.value, password:newPass.value }
    })
    newLogin.value = newPass.value = ''
    alert('Administrateur créé.')
  }
  </script>
  