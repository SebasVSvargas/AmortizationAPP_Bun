import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const scenario = await prisma.scenario.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!scenario) {
      return NextResponse.json(
        { error: "Escenario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("Error al obtener escenario:", error);
    return NextResponse.json(
      { error: "Error al obtener escenario" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingScenario) {
      return NextResponse.json(
        { error: "Escenario no encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, loanAmount, interestRate, termMonths, method, customInstallment, extraPayments } = body;

    const scenario = await prisma.scenario.update({
      where: { id },
      data: {
        name,
        loanAmount: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        termMonths: parseInt(termMonths),
        method,
        customInstallment: customInstallment ? parseFloat(customInstallment) : null,
        extraPayments: extraPayments || [],
      },
    });

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("Error al actualizar escenario:", error);
    return NextResponse.json(
      { error: "Error al actualizar escenario" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingScenario) {
      return NextResponse.json(
        { error: "Escenario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.scenario.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Escenario eliminado" });
  } catch (error) {
    console.error("Error al eliminar escenario:", error);
    return NextResponse.json(
      { error: "Error al eliminar escenario" },
      { status: 500 }
    );
  }
}
