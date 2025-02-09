import EditForm from '@/app/(restricted)/user/[id]/edit/edit-form'
import {getUser} from '@/app/actions/users'

export default async function EditUser(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const {id} = params
  const {user} = await getUser(id)

  if (!user) {
    return null
  }

  return <EditForm user={user} />
}
