import DOMPurify from 'isomorphic-dompurify'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import { Calendar, Clock, Link } from 'lucide-react'
import { formatDate } from '~/utils/time'
import type { Patch } from '~/types/api/patch'

export default async function PatchHistory() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-medium">贡献历史</h2>
      </CardHeader>
      <CardBody>{/* <History id={patch.id} /> */}</CardBody>
    </Card>
  )
}
