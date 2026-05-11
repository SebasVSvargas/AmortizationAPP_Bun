const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Crear usuario de prueba
    const user = await prisma.user.create({
        data: {
        email: "svs@gmail.com",
        name: "Sebastian",
        password: hashedPassword,
        },
    });

    console.log("✅ Usuario creado:", user);
    console.log("Contraseña:", "123456");

  // Crear escenario de prueba (opcional)
    const scenario = await prisma.scenario.create({
        data: {
        name: "Mi primer préstamo",
        userId: user.id,
        loanAmount: 10000000,
        interestRate: 1.5,
        termMonths: 60,
        method: "french",
        },
    });

    console.log("✅ Escenario creado:", scenario);
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});
