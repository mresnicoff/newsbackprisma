const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuración adicional de PrismaClient si es necesario
// Por ejemplo, manejar logs o personalizar la conexión
const prismaConfig = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
};

const prismaInstance = new PrismaClient(prismaConfig);

// Manejo de errores globales para Prisma
prismaInstance.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

// Funciones de utilidad o métodos comunes pueden ir aquí
async function connectToDatabase() {
  try {
    await prismaInstance.$connect();
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

async function disconnectFromDatabase() {
  await prismaInstance.$disconnect();
}

// Exportas el cliente de Prisma ya configurado
module.exports = {
  prisma: prismaInstance,
  connectToDatabase,
  disconnectFromDatabase,
};