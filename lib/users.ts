import {User} from '@/@types/apiResponseTypes'

export function sortByString(key: keyof User, array: User[]): User[] {
  return [...array].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const propA = aValue.toUpperCase()
      const propB = bValue.toUpperCase()

      if (propA < propB) {
        return -1
      }
      if (propA > propB) {
        return 1
      }
    }
    return 0
  })
}
