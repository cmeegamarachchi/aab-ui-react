import React from "react"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/Form"
import type { Contact } from "./models"
import { DatePicker } from "@/components/DatePicker"

const contactSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  signed_on_date: z.date().min(new Date(), "Signed on date must be today or in the future"),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
})

export type ContactFormValues = z.infer<typeof contactSchema>
type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

interface ContactFormProps {
  initialValues?: Partial<Contact>
  onSubmit: (values: ContactFormValues) => void
  loading?: boolean
}

const ContactForm: React.FC<ContactFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [values, setValues] = React.useState<ContactFormValues>({
    id: initialValues?.id,
    first_name: initialValues?.first_name ?? "",
    last_name: initialValues?.last_name ?? "",
    email: initialValues?.email ?? "",
    signed_on_date: initialValues?.signed_on_date
      ? new Date(initialValues.signed_on_date)
      : new Date(),
    street_address: initialValues?.street_address ?? "",
    city: initialValues?.city ?? "",
    country: initialValues?.country ?? "",
  })
  const [errors, setErrors] = React.useState<ContactFormErrors>({})

  React.useEffect(() => {
    setValues({
      id: initialValues?.id,
      first_name: initialValues?.first_name ?? "",
      last_name: initialValues?.last_name ?? "",
      email: initialValues?.email ?? "",
      signed_on_date: initialValues?.signed_on_date
        ? new Date(initialValues.signed_on_date)
        : new Date(),
      street_address: initialValues?.street_address ?? "",
      city: initialValues?.city ?? "",
      country: initialValues?.country ?? "",
    })
    setErrors({})
  }, [initialValues])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: ContactFormErrors = {}
      const zodErrors = parsed.error.flatten().fieldErrors

      if (zodErrors.first_name?.[0]) fieldErrors.first_name = zodErrors.first_name[0]
      if (zodErrors.last_name?.[0]) fieldErrors.last_name = zodErrors.last_name[0]
      if (zodErrors.email?.[0]) fieldErrors.email = zodErrors.email[0]
      if (zodErrors.signed_on_date?.[0]) fieldErrors.signed_on_date = zodErrors.signed_on_date[0]
      if (zodErrors.street_address?.[0]) fieldErrors.street_address = zodErrors.street_address[0]
      if (zodErrors.city?.[0]) fieldErrors.city = zodErrors.city[0]
      if (zodErrors.country?.[0]) fieldErrors.country = zodErrors.country[0]

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSubmit(parsed.data)
  }

  return (
    <Form>
      <form onSubmit={handleSubmit} className="space-y-4 m-4">
        <FormField name="first_name" error={errors.first_name}>
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                name="first_name"
                value={values.first_name}
                onChange={(event) => setValues((current) => ({ ...current, first_name: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="last_name" error={errors.last_name}>
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                name="last_name"
                value={values.last_name}
                onChange={(event) => setValues((current) => ({ ...current, last_name: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="email" error={errors.email}>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="signed_on_date" error={errors.signed_on_date}>
          <FormItem>
            <FormLabel>Sign on date</FormLabel>
            <FormControl>
              <DatePicker
                date={values.signed_on_date}
                onChange={(date) => {
                  if (date) {
                    setValues((current) => ({ ...current, signed_on_date: date }))
                  }
                }}
                placeholder="Select end date"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="street_address" error={errors.street_address}>
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input
                name="street_address"
                value={values.street_address}
                onChange={(event) => setValues((current) => ({ ...current, street_address: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="city" error={errors.city}>
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input
                name="city"
                value={values.city}
                onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="country" error={errors.country}>
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input
                name="country"
                value={values.country}
                onChange={(event) => setValues((current) => ({ ...current, country: event.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}

export default ContactForm
