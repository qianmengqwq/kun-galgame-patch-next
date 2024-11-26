import { z } from 'zod'
import { publicProcedure } from '~/lib/trpc'
import { prisma } from '~/prisma/index'
import type { PatchResource } from '~/types/api/patch'

export const getPatchResource = publicProcedure
  .input(
    z.object({
      patchId: z.number()
    })
  )
  .query(async ({ ctx, input }) => {
    const { patchId } = input

    const data = await prisma.patch_resource.findMany({
      where: { patch_id: patchId },
      include: {
        user: {
          include: {
            patch_resource: true
          }
        },
        link: {
          select: {
            id: true,
            type: true,
            hash: true,
            content: true
          }
        },
        like_by: {
          include: {
            user: true
          }
        }
      }
    })

    const resources: PatchResource[] = data.map((resource) => ({
      id: resource.id,
      size: resource.size,
      type: resource.type,
      link: resource.link,
      language: resource.language,
      note: resource.note,
      password: resource.password,
      platform: resource.platform,
      likedBy: resource.like_by.map((likeRelation) => ({
        id: likeRelation.user.id,
        name: likeRelation.user.name,
        avatar: likeRelation.user.avatar
      })),
      status: resource.status,
      userId: resource.user_id,
      patchId: resource.patch_id,
      created: String(resource.created),
      updated: String(resource.updated),
      code: resource.code,
      user: {
        id: resource.user.id,
        name: resource.user.name,
        avatar: resource.user.avatar,
        patchCount: resource.user.patch_resource.length
      }
    }))

    return resources
  })
