"use client"

import { DatePicker } from "@cfce/components/form"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import ButtonBlue from "~/components/buttonblue"
import FileView from "~/components/form/fileview"
import Select from "~/components/form/select"
import TextArea from "~/components/form/textarea"
import TextInput from "~/components/form/textinput"
import dateToPrisma from "~/utils/DateToPrisma"
import { createInitiative } from "./action"

type InitiativeFormProps = {
  orgId: string
}

type FormData = {
  title: string
  description: string
  start?: Date
  finish?: Date
  image: FileList
}

export default function InitiativeForm({ orgId }: InitiativeFormProps) {
  //const [providers, setProviders] = useState([])
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState("SUBMIT")
  const [message, setMessage] = useState(
    "Enter initiative info and upload image",
  )

  const { register, handleSubmit, watch, control } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  const image = watch("image")

  /*
  function listCredits() {
    return [
      { id: '0', name: 'No credits' },
      { id: '1', name: 'Carbon credits' },
      { id: '2', name: 'Plastic credits' },
      { id: '3', name: 'Biodiversity credits' }
    ]
  }

  function listProviders() {
    if (!providers) {
      return [{ id: 0, name: 'No providers' }]
    }
    const list = []
    for (let i = 0; i < providers.length; i++) {
      list.push({ id: providers[i].id, name: providers[i].name })
    }
    return list
  }
*/

  const onSubmit = async (data: FormData) => {
    console.log("FORM", data)

    if (!data.title || !data.description || !data.image) {
      setMessage("Error: Missing required fields")
      return
    }
    setButtonDisabled(true)
    setButtonText("WAIT")
    setMessage("Saving initiative...")
    try {
      const result = await createInitiative(data, orgId)

      if (result.success) {
        setMessage("Initiative saved successfully")
        setButtonText("DONE")
      } else {
        setMessage(`Error: ${result.error}`)
        setButtonText("SUBMIT")
        setButtonDisabled(false)
      }
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
      setButtonText("SUBMIT")
      setButtonDisabled(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FileView
        id="imgFile"
        {...register("image")}
        source="/media/upload.jpg"
        width={250}
        height={250}
        multiple={false}
      />
      {/*<input type="file" {...register('image')} className="mt-4 w-full" />*/}
      <TextInput label="Title" {...register("title")} />
      <TextArea label="Description" {...register("description")} />
      <Controller
        control={control}
        name="start"
        render={({ field }) => (
          <DatePicker
            label="Start Date"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="finish"
        render={({ field }) => (
          <DatePicker
            label="End Date"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />

      {/*
      <Select
        label="Credits"
        register={register('creditType')}
        options={listCredits()}
      />
      {typeof creditType === 'undefined' || creditType === '0' ? (
        ''
      ) : (
        <div className="mb-6 px-12 py-6 bg-slate-700 rounded-lg">
          <Select
            label="Provider"
            register={register('provider')}
            options={listProviders()}
          />
          <TextInput
            label="Description"
            register={register('creditDesc')}
          />
          <TextInput label="Amount to offset one credit" register={register('creditAmount')} />
        </div>
      )}
*/}

      <ButtonBlue
        id="buttonSubmit"
        type="submit"
        text={buttonText}
        disabled={buttonDisabled}
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </form>
  )
}
