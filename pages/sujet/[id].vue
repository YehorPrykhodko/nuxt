<template>
  <v-container>
    <h1>Sujet : {{ titreSujet }}</h1>

    <!-- Liste des messages -->
    <v-row>
      <v-col v-for="m in messages" :key="m.id" cols="12">
        <v-card class="mb-2">
          <v-card-title>
            <div>
              <strong>{{ m.auteur }}</strong>
              <small>le {{ new Date(m.created_at).toLocaleString() }}</small>
            </div>
            <v-spacer />
            <!-- Actions édition/suppression -->
            <template v-if="m.user_id === sess.user?.id || sess.user?.role === 'admin'">
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

    <!-- Pagination -->
    <v-pagination v-model="page" :length="pages" @input="reload" class="my-4" />

    <!-- Formulaire de réponse -->
    <v-card v-if="sess.user">
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWs } from '~/composables/useWs'

const route = useRoute()
const sujetId = Number(route.params.id)
console.log('[PAGE sujet] sujetId =', sujetId)

const nouveauMsg = ref('')
const { connect, send, lastEvent } = useWs()

onMounted(() => {
  console.log('[PAGE sujet] onMounted')
  connect()
})

watch(lastEvent, evt => {
  console.log('[WS EVENT sujet]', evt)
  if (evt?.type === 'newMessage' && evt.payload.sujetId === sujetId) {
    // reload messages…
  }
})

async function postMsg() {
  console.log('[sujet] postMsg', nouveauMsg.value)
  await $fetch('/api/messages', {
    method: 'POST',
    credentials: 'include',
    body: { sujetId, contenu: nouveauMsg.value }
  })
  console.log('[sujet] Message posted')
  send('newMessage', { sujetId })
  nouveauMsg.value = ''
}
</script>


<style scoped>
h1 { margin-bottom: 1rem }
</style>
