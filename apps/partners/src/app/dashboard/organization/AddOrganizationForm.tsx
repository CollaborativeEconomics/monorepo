"use client"
import type { Prisma } from "@cfce/database"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrganizationAction } from "./actions"
import ButtonBlue from "~/components/buttonblue"
import Select from "~/components/form/select"
import TextInput from "~/components/form/textinput"
import styles from "~/styles/dashboard.module.css"

interface Category {
  id: string
  name: string
}

export default function AddOrganizationForm({
  categories,
}: {
  categories: Category[]
}) {
  // Sort categories
  const categoryOptions = categories.sort((item1, item2) => {
    if (item1.name.toLowerCase() < item2.name.toLowerCase()) return -1
    if (item1.name.toLowerCase() > item2.name.toLowerCase()) return 1
    return 0
  })

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }

  function getFormData(form: HTMLFormElement) {
    const data = {} as Prisma.OrganizationCreateInput
    const formData = new FormData(form)
    //console.log('FORM', formData);
    for (const [name, value] of formData) {
      console.log(name, value)
      if (name === "categoryId") {
        data.category = { connect: { id: value as string } }
      } else {
        // @ts-ignore: I hate this
        data[name as string] = value as string
      }
    }
    return data
  }

  //async function onSubmit(data: Prisma.OrganizationCreateInput) {
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const data = getFormData(event.currentTarget as HTMLFormElement)
    console.log("SUBMIT", data)

    if (!data.name) {
      showMessage("Name is required")
      return
    }
    if (!data.email) {
      showMessage("Email is required")
      return
    }

    try {
      showMessage("Saving organization to database...")
      setButtonState(ButtonState.WAIT)
      const useTBA = true
      const result = await createOrganizationAction(data, useTBA)
      if (result.success) {
        setChange(change + 1)
        showMessage("Organization saved")
        setButtonState(ButtonState.DONE)
      } else {
        showMessage(`Error saving organization: ${result.error}`)
        setButtonState(ButtonState.READY)
      }
    } catch (ex: unknown) {
      console.error(ex)
      showMessage(`Error saving organization: ${(ex as Error).message}`)
      setButtonState(ButtonState.READY)
    }
  }

  function setButtonState(state: number) {
    switch (state) {
      case ButtonState.READY:
        setButtonText("SUBMIT")
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText("WAIT")
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText("DONE")
        setButtonDisabled(true)
        break
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState("SUBMIT")
  const [message, showMessage] = useState(
    "Enter organization info and click on submit",
  )
  const [change, setChange] = useState(0)

  // Form data
  const { register, watch } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      email: "",
      EIN: "",
      phone: "",
      mailingAddress: "",
      country: "",
      image: "",
      background: "",
      url: "",
      twitter: "",
      facebook: "",
    },
  })
  const [
    name,
    slug,
    description,
    email,
    EIN,
    phone,
    mailingAddress,
    country,
    image,
    background,
    url,
    twitter,
    facebook,
  ] = watch([
    "name",
    "slug",
    "description",
    "email",
    "EIN",
    "phone",
    "mailingAddress",
    "country",
    "image",
    "background",
    "url",
    "twitter",
    "facebook",
  ])

  useEffect(() => {
    console.log("Org changed!", change)
  }, [change])

  return (
    <div className={styles.mainBox}>
      <form className={styles.vbox} onSubmit={onSubmit}>
        <TextInput label="Name" name="name" register={register("name")} />
        <TextInput label="Slug" name="slug" register={register("slug")} />
        <TextInput
          label="Description"
          name="description"
          register={register("description")}
        />
        <TextInput label="Email" name="email" register={register("email")} />
        <TextInput label="EIN" name="EIN" register={register("EIN")} />
        <TextInput label="Phone" name="phone" register={register("phone")} />
        <TextInput
          label="Address"
          name="mailingAddress"
          register={register("mailingAddress")}
        />
        <TextInput
          label="Country"
          name="country"
          register={register("country")}
        />
        <TextInput
          label="Image (url)"
          name="image"
          register={register("image")}
        />
        <TextInput
          label="Background (url)"
          name="background"
          register={register("background")}
        />
        <TextInput label="website" name="url" register={register("url")} />
        <TextInput
          label="Twitter"
          name="twitter"
          register={register("twitter")}
        />
        <TextInput
          label="Facebook"
          name="facebook"
          register={register("facebook")}
        />
        <Select label="Category" name="categoryId" options={categoryOptions} />
        <ButtonBlue
          type="submit"
          id="buttonSubmit"
          text={buttonText}
          disabled={buttonDisabled}
        />
      </form>
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  )
}
