import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormProps = {
  children: React.ReactNode
}

const Form = ({ children }: FormProps) => children

type FormFieldContextValue = {
  name: string
  error?: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

type FormFieldProps = {
  name: string
  error?: string
  children: React.ReactNode
}

const FormField = ({ name, error, children }: FormFieldProps) => {
  return (
    <FormFieldContext.Provider value={{ name, error }}>
      {children}
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (fieldContext === null) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (itemContext === null) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error: fieldContext.error,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FormLabel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

const FormControl = ({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

const FormMessage = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { error, formMessageId } = useFormField()
  const body = error ?? children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
