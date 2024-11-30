'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Link } from '@nextui-org/link'
import toast from 'react-hot-toast'
import { passwordSchema } from '~/validations/user'
import { kunFetchPost } from '~/utils/kunFetch'
import { useErrorHandler } from '~/hooks/useErrorHandler'

type PasswordFormData = z.infer<typeof passwordSchema>

export const Password = () => {
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  })

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true)

    await kunFetchPost('/user/setting/password', data)

    setLoading(false)

    reset()
    toast.success('更改密码成功!')
  }

  return (
    <Card className="w-full text-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <h2 className="text-xl font-medium">密码</h2>
        </CardHeader>
        <CardBody className="py-0 space-y-4">
          <div>
            <p>这是您的密码设置, 您需要输入旧密码以更改新密码</p>
          </div>
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="旧密码"
                autoComplete="old-password"
                isInvalid={!!errors.oldPassword}
                errorMessage={errors.oldPassword?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="新密码"
                autoComplete="new-password"
                isInvalid={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
              />
            )}
          />
        </CardBody>

        <CardFooter className="flex-wrap">
          <p className="text-gray-500">
            密码长度最短 6 个字符, 最长 1000 个字符, 可以包含任意字符,
            至少包含数字和英语字母
          </p>
          <Button
            type="submit"
            color="primary"
            variant="solid"
            className="ml-auto"
            isLoading={loading}
          >
            保存
          </Button>
        </CardFooter>

        <Divider />

        <CardFooter>
          <Link showAnchorIcon href="/auth/forgot">
            忘记密码?
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
