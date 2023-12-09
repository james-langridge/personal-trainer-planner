'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {USER_TYPE} from '@prisma/client'
import {ExclamationTriangleIcon} from '@radix-ui/react-icons'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React, {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import * as z from 'zod'

import {Alert, AlertDescription, AlertTitle} from '@/components/alert'
import {Button} from '@/components/button'
import {Fetching} from '@/components/Fetching'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form'
import {Input} from '@/components/input'
import {RadioGroup, RadioGroupItem} from '@/components/radio-group'
import {useToast} from '@/components/use-toast'
import {useGetUserQuery, useUpdateUserMutation} from '@/redux/services/users'

const formSchema = z.object({
  credits: z.string(),
  email: z.string(),
  id: z.string(),
  fee: z.string(),
  name: z.string(),
  type: z.nativeEnum(USER_TYPE),
})

export default function EditUser({params}: {params: {slug: string}}) {
  const [error, setError] = useState('')
  const router = useRouter()
  const {slug} = params
  const {data: session, status} = useSession()
  const {data: user, isFetching} = useGetUserQuery(slug)
  const [updateUser, {isLoading}] = useUpdateUserMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credits: user?.credits.toString(),
      email: user?.email || '',
      id: user?.id || '',
      fee: user?.fee ? (user.fee / 100).toFixed(2) : '0.00',
      name: user?.name || '',
      type: user?.type || USER_TYPE.INDIVIDUAL,
    },
  })
  const {toast} = useToast()

  useEffect(() => {
    if (!user) {
      return
    }

    form.reset({
      credits: user.credits.toString(),
      email: user.email || '',
      id: user.id || '',
      fee: (user.fee / 100).toFixed(2) || '0.00',
      name: user.name || '',
      type: user.type || USER_TYPE.INDIVIDUAL,
    })
  }, [user])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return <p>Access Denied</p>
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser({
      ...values,
      credits: Number(values.credits),
      fee: Math.round(parseFloat(values.fee) * 100),
    })
      .unwrap()
      .then(() => {
        toast({
          description: 'Client updated successfully.',
        })

        router.back()
      })
      .catch(error => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.data.message,
        })
        setError(error.data.message)
      })
  }

  return (
    <div className="container space-y-8 p-5">
      {isFetching ? (
        <Fetching />
      ) : (
        <h2 className="text-2xl font-bold capitalize leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Editing {user?.name}
        </h2>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({field}) => (
              <FormItem className="space-y-3">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={USER_TYPE.INDIVIDUAL} />
                      </FormControl>
                      <FormLabel className="font-normal">Individual</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={USER_TYPE.BOOTCAMP} />
                      </FormControl>
                      <FormLabel className="font-normal">Bootcamper</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fee"
            render={({field}) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credits"
            render={({field}) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-2">
            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading ? 'Updating...' : 'Submit'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.back()}
              disabled={isLoading || isFetching}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
