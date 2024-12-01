import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParseGetQuery } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import type { UserInfo } from '~/types/api/user'

const getProfileSchema = z.object({
  id: z.coerce.number().min(1).max(9999999).optional()
})

export const getUserProfile = async (
  input: z.infer<typeof getProfileSchema>
) => {
  const data = await prisma.user.findUnique({
    where: { id: input.id },
    include: {
      _count: {
        select: {
          patch_resource: true,
          patch: true,
          patch_comment: true,
          patch_favorite: true
        }
      },
      follower: true,
      following: true
    }
  })
  if (!data) {
    return '未找到用户'
  }

  const followerUserUid = data.following.map((f) => f.follower_id)

  const user: UserInfo = {
    id: data.id,
    requestUserUid: input.id ?? 0,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    bio: data.bio,
    role: data.role,
    status: data.status,
    registerTime: String(data.register_time),
    moemoepoint: data.moemoepoint,
    follower: data.following.length,
    following: data.follower.length,
    isFollow: followerUserUid.includes(input.id ?? 0),
    _count: data._count
  }

  return user
}

export async function GET(req: NextRequest) {
  const input = kunParseGetQuery(req, getProfileSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const user = await getUserProfile(input)
  return NextResponse.json(user)
}
