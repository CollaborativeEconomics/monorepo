"use client"
import { DatePicker } from "@cfce/components/form"
import type { Initiative } from "@cfce/database/types"
import { InitiativeStatus } from "@cfce/database/types"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  createInitiativeAction,
  editInitiativeAction,
} from "~/app/dashboard/initiatives/action"
//import { InitiativeStatus as Status } from "@cfce/types"
import InitiativeStatusSelect from "~/components/InitiativeStatusSelect"
import ButtonBlue from "~/components/buttonblue"
import FileView from "~/components/form/fileview"
import Select from "~/components/form/select"
import TextArea from "~/components/form/textarea"
import TextInput from "~/components/form/textinput"
import type { FormMode, InitiativeData } from "~/types/data"
import { FormMode as Mode } from "~/types/data"
import dateToPrisma from "~/utils/DateToPrisma"

export default function InitiativeForm({
  id,
  initiative,
  formMode,
}: {
  id?: string
  initiative: InitiativeData
  formMode: FormMode
}) {
  console.log("INIT", initiative)
  /*
  function getFormData(form: HTMLFormElement) {
    const data:InitiativeData = {organizationId:'', title:'', description:''}
    const formData = new FormData(form);
    //console.log('FORM', formData);
    for (const [name, value] of formData) {
      console.log(name, value);
      data[name as keyof InitiativeData] = value as string & File;
    }
    return data;
  }
*/

  async function onSubmit(data: InitiativeData) {
    //event.preventDefault();
    //const data = getFormData(event.currentTarget as HTMLFormElement);
    console.log("SUBMIT", data)

    if (!data.title) {
      showMessage("Error: Title is a required field")
      return
    }
    if (!data.description) {
      showMessage("Error: Description is a required field")
      return
    }
    if (!data.image) {
      showMessage("Error: Image is a required field")
      return
    }
    if (data.start && data.finish && data.start > data.finish) {
      showMessage("Start date must be before end date")
      return
    }

    //data.initiativeId = initiative.id
    data.organizationId = initiative.organizationId
    data.imageUri = initiative.imageUri || undefined
    data.defaultAsset = initiative.defaultAsset || undefined
    data.status = initiativeStatus // as InitiativeStatus // from select control
    console.log("FORM", data)

    setButtonDisabled(true)
    setButtonText("WAIT")
    showMessage("Saving initiative, it may take a while...")

    try {
      let result = null
      switch (formMode) {
        case Mode.New: {
          const useTBA = true
          result = await createInitiativeAction(
            data,
            initiative.organizationId,
            useTBA,
          )
          break
        }
        case Mode.Edit: {
          if (id) {
            result = await editInitiativeAction(id, data)
          }
          break
        }
        default:
          break
      }
      if (result?.success) {
        showMessage("Initiative saved successfully")
        setButtonState(ButtonState.DONE)
      } else {
        showMessage(`Error saving initiative: ${result?.error}`)
        setButtonState(ButtonState.READY)
      }
    } catch (ex: unknown) {
      console.error(ex)
      showMessage(`Error saving initiative: ${(ex as Error).message}`)
      setButtonState(ButtonState.READY)
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState("SUBMIT")

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

  const [message, showMessage] = useState(
    "Enter initiative info and upload image",
  )
  const [initiativeStatus, setInitiativeStatus] = useState<InitiativeStatus>(
    initiative.status || InitiativeStatus.Draft,
  )

  const { register, handleSubmit, watch, control } = useForm<InitiativeData>({
    defaultValues: {
      title: initiative.title,
      description: initiative.description,
      start: initiative.start,
      finish: initiative.finish,
      status: initiative.status || InitiativeStatus.Draft,
    },
  })

  //const image = watch('image');
  const imageSource = initiative.defaultAsset ?? "/media/upload.jpg"

  const [title, description, start, finish, image, status] = watch([
    "title",
    "description",
    "start",
    "finish",
    "image",
    "status",
  ])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FileView
        id="imgFile"
        {...register("image")}
        source={imageSource}
        width={250}
        height={250}
        multiple={false}
      />
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
      <InitiativeStatusSelect
        status={initiative.status || InitiativeStatus.Draft}
        handler={(val: InitiativeStatus) => {
          console.log("STATUS", val)
          //setValue("status", val, { shouldValidate: true }) // Rabbit suggests this <<<
          //const newStatus = InitiativeStatus[key] // doesn't work
          setInitiativeStatus(val)
        }}
      />
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
