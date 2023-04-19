'use client'

import Container from '@/components/Container'
import ClientsTable from '@/components/ClientsTable'

export default function Clients() {
  return (
    <Container>
      <h1 className="prose text-6xl font-bold leading-normal">Clients</h1>
      <ClientsTable />
    </Container>
  )
}
