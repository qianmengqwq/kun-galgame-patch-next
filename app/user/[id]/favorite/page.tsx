import { UserFavorite } from '~/components/user/favorite/Container'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import { generateKunMetadataTemplate } from './metadata'
import { kunGetUserStatusActions } from '../actions'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { id } = await params
  const user = await kunGetUserStatusActions(Number(id))
  const response = await kunGetActions({
    uid: Number(id),
    page: 1,
    limit: 20
  })
  if (typeof user === 'string' || typeof response === 'string') {
    return {}
  }
  return generateKunMetadataTemplate(user, response.favorites)
}

export default async function Kun({ params }: Props) {
  const { id } = await params

  const response = await kunGetActions({
    uid: Number(id),
    page: 1,
    limit: 20
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <UserFavorite
      favorites={response.favorites}
      total={response.total}
      uid={Number(id)}
    />
  )
}
