import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const scenarios = await prisma.scenario.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error("Error al obtener escenarios:", error);
    return NextResponse.json(
      { error: "Error al obtener escenarios" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, loanAmount, interestRate, termMonths, method, customInstallment, extraPayments, internalDebt } = body;

    if (!name || !loanAmount || !interestRate || !termMonths) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const scenario = await prisma.scenario.create({
      data: {
        name,
        userId: session.user.id,
        loanAmount: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        termMonths: parseInt(termMonths),
        method: method || "french",
        customInstallment: customInstallment ? parseFloat(customInstallment) : null,
        extraPayments: extraPayments || [],
        internalDebt: internalDebt || {},
      },
    });

    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    console.error("Error al crear escenario:", error);
    return NextResponse.json(
      { error: "Error al crear escenario" },
      { status: 500 }
    );
  }
}
