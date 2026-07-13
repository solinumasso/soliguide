<script lang="ts">
  import { page } from '$app/stores';
</script>

<section style="padding:100px">
  <h1>Oups ! {$page.error?.message}</h1>
  <p>
    Code : {$page.status}
  </p>
  <p>
    <a href="/">Retour à l'accueil</a>
  </p>
</section>
