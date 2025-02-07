import { CardContainer } from '~/components/comment/Container'
import { kunMetadata } from './metadata'
import { Suspense } from 'react'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import type { Metadata } from 'next'

export const revalidate = 5

export const metadata: Metadata = kunMetadata

interface Props {
  searchParams?: Promise<{ page?: number }>
}

export default async function Kun({ searchParams }: Props) {
  const res = await searchParams
  const currentPage = res?.page ? res.page : 1

  const response = await kunGetActions({
    sortField: 'created',
    sortOrder: 'desc',
    page: currentPage,
    limit: 50
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <CardContainer
        initialComments={response.comments}
        initialTotal={response.total}
      />
    </Suspense>
  )
}
