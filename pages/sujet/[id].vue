<template>
  <v-container>
    <h1>Sujet : {{ titreSujet }}</h1>

    <v-row>
      <v-col v-for="m in messages" :key="m.id" cols="12">
        <v-card class="mb-2">
          <v-card-title>
            <div>
              <strong>{{ m.auteur }}</strong>
              <small>le {{ new Date(m.created_at).toLocaleString() }}</small>
            </div>
            <v-spacer />
            <template v-if="m.user_id === session?.id || session?.role === 'admin'">
              <v-btn icon small @click="startEdit(m)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon small color="error" @click="supprimeMsg(m.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
          </v-card-title>
          <v-card-text>
            <div v-if="editId !== m.id">{{ m.contenu }}</div>
            <div v-else>
              <v-textarea v-model="editContenu" rows="3" />
              <v-btn small @click="valideEdit(m.id)">Valider</v-btn>
              <v-btn small text @click="cancelEdit">Annuler</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-card v-if="session">
      <v-card-title>Répondre</v-card-title>
      <v-card-text>
        <v-textarea v-model="nouveauMsg" label="Votre message" rows="4" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="postMsg">Envoyer</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>
      <NuxtLink to="/login">Connecte-toi</NuxtLink> pour répondre.
    </div>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { useWs } from '~/composables/useWs'

const auth = useAuthStore()
const session = computed(() => auth.user)

const route = useRoute()
const sujetId = Number(route.params.id)

const titreSujet = ref('')
const messages = ref<any[]>([])
const nouveauMsg = ref('')
const editId = ref<number | null>(null)
const editContenu = ref('')

const { connect, send, lastEvent } = useWs()

async function fetchSujet() {
  const res: any = await $fetch(`/api/sujets/${sujetId}`)
  titreSujet.value = res.titre
  messages.value = res.messages
}

onMounted(async () => {
  connect()
  await fetchSujet()
})

watch(lastEvent, evt => {
  if (
    ['newMessage', 'updateMessage', 'deleteMessage'].includes(evt?.type!) &&
    evt.payload.sujetId === sujetId
  ) {
    fetchSujet()
  }
})

async function postMsg() {
  await $fetch('/api/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    body: { sujetId, contenu: nouveauMsg.value }
  })
  send('newMessage', { sujetId })
  nouveauMsg.value = ''
}

function startEdit(m: any) {
  editId.value = m.id
  editContenu.value = m.contenu
}

function cancelEdit() {
  editId.value = null
  editContenu.value = ''
}

async function valideEdit(id: number) {
  await $fetch(`/api/messages/${id}`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${auth.token}`
  },
  body: { contenu: editContenu.value }
})

  send('updateMessage', { sujetId })
  editId.value = null
  fetchSujet()
}

async function supprimeMsg(id: number) {
  await $fetch(`/api/messages/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  send('deleteMessage', { sujetId })
  fetchSujet()
}
</script>



<style scoped>
h1 { margin-bottom: 1rem; }
</style>
