<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Página no encontrada</h2>
    <p>Lo sentimos, la página que buscas no existe.</p>
    <RouterLink to="/" class="btn btn-primary">
      Volver al inicio
    </RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.not-found h1 {
  font-size: 8rem;
  margin: 0;
  color: #007bff;
  line-height: 1;
}

.not-found h2 {
  margin: 0 0 1rem;
  color: #333;
}

.not-found p {
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
