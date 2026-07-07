import prisma from '../lib/prisma.js'

import type {
  CreateChecklistDTO,
  UpdateChecklistDTO
} from '../schemas/checklistSchema.js'

export async function createChecklist(data: CreateChecklistDTO) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: data.tripId
    }
  })

  if (!trip) {
    throw new Error('Viagem não encontrada.')
  }

  return prisma.checklist.create({
    data
  })
}

export async function getAllChecklists() {
  return prisma.checklist.findMany({
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getChecklistById(id: number) {
  const checklist = await prisma.checklist.findUnique({
    where: {
      id
    },
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
          imageUrl: true
        }
      }
    }
  })

  if (!checklist) {
    throw new Error('Checklist não encontrado.')
  }

  return checklist
}

export async function updateChecklist(
  id: number,
  data: UpdateChecklistDTO
) {
  const checklist = await prisma.checklist.findUnique({
    where: {
      id
    }
  })

  if (!checklist) {
    throw new Error('Checklist não encontrado.')
  }

  return prisma.checklist.update({
    where: {
      id
    },
    data
  })
}

export async function deleteChecklist(id: number) {
  const checklist = await prisma.checklist.findUnique({
    where: {
      id
    }
  })

  if (!checklist) {
    throw new Error('Checklist não encontrado.')
  }

  await prisma.checklist.delete({
    where: {
      id
    }
  })

  return {
    message: 'Checklist removido com sucesso.'
  }
}