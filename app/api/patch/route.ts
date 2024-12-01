import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParseGetQuery, kunParseFormData } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { updatePatchBannerSchema } from '~/validations/patch'
import { uploadPatchBanner } from '../edit/_upload'
import type { Patch } from '~/types/api/patch'

const patchIdSchema = z.object({
  patchId: z.coerce.number().min(1).max(9999999)
})

export const getPatchById = async (
  input: z.infer<typeof patchIdSchema>,
  uid: number
) => {
  const { patchId } = input

  const patch = await prisma.patch.findUnique({
    where: { id: patchId },
    include: {
      user: true,
      _count: {
        select: {
          favorite_by: true,
          contribute_by: true,
          resource: true,
          comment: true
        }
      },
      favorite_by: {
        where: {
          user_id: uid
        }
      }
    }
  })

  if (!patch) {
    return '未找到对应补丁'
  }

  await prisma.patch.update({
    where: { id: patch.id },
    data: { view: { increment: 1 } }
  })

  const response: Patch = {
    id: patch.id,
    name: patch.name,
    introduction: patch.introduction,
    banner: patch.banner,
    status: patch.status,
    view: patch.view,
    type: patch.type,
    language: patch.language,
    platform: patch.platform,
    alias: patch.alias,
    isFavorite: patch.favorite_by.length > 0,
    user: {
      id: patch.user.id,
      name: patch.user.name,
      avatar: patch.user.avatar
    },
    created: String(patch.created),
    _count: patch._count
  }

  return response
}

export const GET = async (req: NextRequest) => {
  const input = kunParseGetQuery(req, patchIdSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)

  const response = await getPatchById(input, payload?.uid ?? 0)
  return NextResponse.json(response)
}

export const updatePatchBanner = async (
  image: ArrayBuffer,
  patchId: number,
  uid: number
) => {
  const res = await uploadPatchBanner(image, patchId)
  if (!res) {
    return '上传图片错误, 未知错误'
  }
  if (typeof res === 'string') {
    return res
  }

  await prisma.patch_history.create({
    data: {
      action: '更新了',
      type: '预览图',
      content: '',
      user_id: uid,
      patch_id: patchId
    }
  })
}

export const PUT = async (req: NextRequest) => {
  const input = await kunParseFormData(req, updatePatchBannerSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  const image = await new Response(input.image)?.arrayBuffer()

  const response = await updatePatchBanner(image, input.patchId, payload.uid)
  return NextResponse.json(response)
}
