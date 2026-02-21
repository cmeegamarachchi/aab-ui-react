import { useActionState, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import * as z from "zod"
import { useConfiguration } from "@/providers/ConfigurationProvider"

import { toast } from "sonner"

const settingsSchema = z.object({
  baseUrl: z
    .string()
    .trim()
    .min(1, { message: "Base URL is required" })
    .refine((value) => {
      try {
        const parsedUrl = new URL(value)
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
      } catch {
        return false
      }
    }, { message: "Please enter a valid http(s) URL" }),
  itemsPerPage: z.number().int().positive().max(100),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  theme: z.enum(["light", "dark", "system"]),
})

type SettingsValues = z.infer<typeof settingsSchema>
type SettingsErrors = Partial<Record<keyof SettingsValues, string>>

type SubmitState = {
  status: "idle" | "success" | "error"
  message?: string
}

const defaultValues: SettingsValues = {
  baseUrl: "",
  itemsPerPage: 10,
  apiKey: "nothing",
  theme: "light",
}

export default function SettingsForm() {
  const config = useConfiguration()
  const [values, setValues] = useState<SettingsValues>(defaultValues)
  const [errors, setErrors] = useState<SettingsErrors>({})

  const [submitState, submitAction, isPending] = useActionState<SubmitState, FormData>(
    async (_prevState, formData) => {
      const candidate: SettingsValues = {
        baseUrl: String(formData.get("baseUrl") ?? ""),
        itemsPerPage: Number.parseInt(String(formData.get("itemsPerPage") ?? "0"), 10),
        apiKey: String(formData.get("apiKey") ?? ""),
        theme: String(formData.get("theme") ?? "light") as SettingsValues["theme"],
      }

      const parsed = settingsSchema.safeParse(candidate)
      if (!parsed.success) {
        const fieldErrors: SettingsErrors = {}
        const zodErrors = parsed.error.flatten().fieldErrors

        if (zodErrors.baseUrl?.[0]) {
          fieldErrors.baseUrl = zodErrors.baseUrl[0]
        }
        if (zodErrors.itemsPerPage?.[0]) {
          fieldErrors.itemsPerPage = zodErrors.itemsPerPage[0]
        }
        if (zodErrors.apiKey?.[0]) {
          fieldErrors.apiKey = zodErrors.apiKey[0]
        }
        if (zodErrors.theme?.[0]) {
          fieldErrors.theme = zodErrors.theme[0]
        }

        setErrors(fieldErrors)
        return { status: "error" }
      }

      setErrors({})

      try {
        const currenrConfig = await config.configuration
        currenrConfig.apiBaseUrl = parsed.data.baseUrl
        currenrConfig.numberOfItemsPerPage = parsed.data.itemsPerPage
        currenrConfig.apiKey = parsed.data.apiKey
        currenrConfig.theme = parsed.data.theme
        config.setConfiguration({ ...currenrConfig })

        return {
          status: "success",
          message: "Your application settings have been successfully updated.",
        }
      } catch {
        return {
          status: "error",
          message: "There was a problem updating your settings.",
        }
      }
    },
    { status: "idle" }
  )

  useEffect(() => {
    setValues({
      baseUrl: config.configuration.apiBaseUrl,
      itemsPerPage: config.configuration.numberOfItemsPerPage,
      apiKey: config.configuration.apiKey,
      theme: config.configuration.theme as "light" | "dark" | "system"
    })
  }, [config.configuration])

  useEffect(() => {
    if (submitState.status === "success" && submitState.message) {
      toast.info(submitState.message)
      return
    }

    if (submitState.status === "error" && submitState.message) {
      toast.error(submitState.message)
    }
  }, [submitState])

  return (
    <Form>
      <form action={submitAction} className="m-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure the general settings for your application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField name="baseUrl" error={errors.baseUrl}>
              <FormItem>
                <FormLabel>Base URL</FormLabel>
                <FormControl>
                  <Input
                    name="baseUrl"
                    placeholder="https://example.com"
                    value={values.baseUrl}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setValues((current) => ({ ...current, baseUrl: nextValue }))
                    }}
                  />
                </FormControl>
                <FormDescription>The base URL for your application.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="itemsPerPage" error={errors.itemsPerPage}>
              <FormItem>
                <FormLabel>Items Per Page</FormLabel>
                <FormControl>
                  <Input
                    name="itemsPerPage"
                    type="number"
                    value={values.itemsPerPage}
                    onChange={(event) => {
                      const rawValue = event.target.value
                      const parsedValue = Number.parseInt(rawValue, 10)
                      setValues((current) => ({
                        ...current,
                        itemsPerPage: Number.isNaN(parsedValue) ? 0 : parsedValue,
                      }))
                    }}
                  />
                </FormControl>
                <FormDescription>The number of items to display per page (max 100).</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure your API settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField name="apiKey" error={errors.apiKey}>
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input
                    name="apiKey"
                    type="password"
                    value={values.apiKey}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setValues((current) => ({ ...current, apiKey: nextValue }))
                    }}
                  />
                </FormControl>
                <FormDescription>Your API key for accessing external services.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the appearance of your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField name="theme" error={errors.theme}>
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <select
                    name="theme"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={values.theme}
                    onChange={(event) => {
                      const nextValue = event.target.value as SettingsValues["theme"]
                      setValues((current) => ({ ...current, theme: nextValue }))
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </FormControl>
                <FormDescription>Choose the theme for your application.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Settings"}
        </Button>
      </form>
    </Form>
  )
}

