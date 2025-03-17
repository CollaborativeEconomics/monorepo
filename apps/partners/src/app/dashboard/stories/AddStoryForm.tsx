"use client"

//import Checkbox from '~/components/form/checkbox';
// import { Checkbox, CheckboxWithText } from '@cfce/components/ui';
import { Alert, AlertDescription, Button, Input } from '@cfce/components/ui';
import type { Category, Initiative } from '@cfce/database';
import React, { useState, type FormEvent } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import FileView from '~/components/form/fileview';
import FilePick from '~/components/form/filepick';
import styles from '~/styles/dashboard.module.css';
import ButtonBlue from '../../../components/buttonblue';
import Select from '../../../components/form/select';
import TextArea from '../../../components/form/textarea';
import TextInput from '../../../components/form/textinput';
import { saveStory } from './actions';

interface AddStoryFormProps {
  userId: string
  orgId: string
  initiatives: Initiative[]
  categories: Category[]
}

interface DataForm {
  initiativeId: string
  categoryId: string
  name: string
  description: string
  amount: string
  image1: FileList
  image2: FileList
  image3: FileList
  image4: FileList
  image5: FileList
  media: FileList
  unitvalue: string
  unitlabel: string
}

export default function AddStoryForm({
  userId,
  orgId,
  initiatives,
  categories,
}: AddStoryFormProps) {
  // const userId = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState("SUBMIT")
  const [message, setMessage] = useState("Enter story info and upload images")

  console.log("ADD STORY FORM")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DataForm>({
    defaultValues: {
      initiativeId: initiatives[0]?.id || "",
      categoryId: initiatives[0]?.categoryId || categories[0]?.id || "",
    },
  })

  const initiativesOptions = initiatives.map((initiative) => ({
    id: initiative.id,
    name: initiative.title,
  }))

  const categoriesOptions = categories.map((category) => ({
    id: category.id,
    name: category.title,
  }))

  const imageFields = watch(["image1", "image2", "image3", "image4", "image5"])
  console.log("IMAGE FIELDS", imageFields)
  const mediaFile = watch("media")
  const imgSource = "/media/upload.jpg"

  const onSubmit: SubmitHandler<DataForm> = async (data) => {
    console.log("DATA:", data)
    if (
      !data.name ||
      !data.description ||
      !data.image1?.[0] ||
      !data.initiativeId
    ) {
      setMessage("All required fields must be filled")
      return
    }

    setButtonDisabled(true)
    setButtonText("WAIT")
    setMessage("Uploading files and saving story...")

    try {
      const images: File[] = [
        data.image1?.[0],
        data.image2?.[0],
        data.image3?.[0],
        data.image4?.[0],
        data.image5?.[0],
      ].filter((img): img is File => img instanceof File && img.size > 0)

      const mediaFile = data.media?.[0]
      const media = mediaFile && mediaFile.size > 0 ? mediaFile : undefined

      const storyData = {
        userId,
        story: {
          name: data.name,
          description: data.description,
          amount: data.amount,
          unitvalue: data.unitvalue,
          unitlabel: data.unitlabel,
        },
        categoryId: data.categoryId,
        organizationId: orgId,
        initiativeId: data.initiativeId,
        images,
        media,
      }

      const storyResponse = await saveStory(storyData, true)
      if (!storyResponse || "error" in storyResponse) {
        setMessage(
          `Error saving story: ${
            (storyResponse as { error: string })?.error || "Unknown error"
          }`,
        )
        setButtonDisabled(false)
        return
      }

      setMessage("Story saved successfully!")
      setButtonText("DONE")
    } catch (error) {
      console.error("Error saving story:", error)
      setMessage(`An error occurred while saving the story: ${(error as Error)?.message||'Unknown'}`)
      setButtonText("ERROR")
      setButtonDisabled(true)
    }
    setTimeout(() => {
      setButtonDisabled(false)
      setButtonText("SUBMIT")
    }, 1800)
  }

  return (
    <div className={styles.mainBox}>
      <form className={styles.vbox} onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload Inputs */}
        <div className={`${styles.hbox} justify-center`}>
          <FileView
            id="image1"
            width={250}
            height={250}
            source={imgSource}
            {...register("image1", { required: true })}
          />
        </div>
        <div className={`${styles.hbox} justify-center`}>
          <FileView
            id="image2"
            width={128}
            height={128}
            source={imgSource}
            {...register("image2")}
          />
          <FileView
            id="image3"
            width={128}
            height={128}
            source={imgSource}
            {...register("image3")}
          />
          <FileView
            id="image4"
            width={128}
            height={128}
            source={imgSource}
            {...register("image4")}
          />
          <FileView
            id="image5"
            width={128}
            height={128}
            source={imgSource}
            {...register("image5")}
          />
        </div>

        {/* Media Input */}
        <FilePick
          label="Other media (PDF, MP3, MP4, etc.):"
          accept=".pdf,.mp3,.mp4,.webm"
          {...register('media')}
        /> 

        {/* Additional form inputs */}
        <Select
          label="Initiative"
          {...register("initiativeId", { required: true })}
          options={initiativesOptions}
        />

        <Select
          label="Category"
          {...register("categoryId", { required: true })}
          options={categoriesOptions}
        />

        <TextInput
          label="Title"
          {...register("name", { required: true, maxLength: 255 })}
          className={errors.name ? "border-red-500" : ""}
          maxLength={255}
        />

        <TextArea
          label="Description"
          {...register("description", { required: true, maxLength: 255 })}
          className={errors.description ? "border-red-500" : ""}
          maxLength={255}
          value={watch("description")}
        />

        <TextInput
          label="Estimated Amount Spent"
          {...register("amount", { required: true, maxLength: 255 })}
          maxLength={255}
        />
        <TextInput
          label="Dollars per unit ($20 per tree, $5 per meal, $150 per wheelchair)"
          {...register("unitvalue", { maxLength: 255 })}
          maxLength={255}
        />
        <TextInput
          label="Unit label (tree, meal, wheelchair)"
          {...register("unitlabel", { maxLength: 255 })}
          maxLength={255}
        />
        <ButtonBlue type="submit" text={buttonText} disabled={buttonDisabled} />

        {/* Validation error handling */}
        {errors.name && <p className="error">Title is required</p>}
        {errors.description && <p className="error">Description is required</p>}
        {errors.amount && <p className="error">Amount is required</p>}
        {errors.initiativeId && <p className="error">Initiative is required</p>}

        {/* Add validation error messages for maxLength */}
        {errors.name?.type === "maxLength" && (
          <p className="error">Title must be less than 255 characters</p>
        )}
        {errors.description?.type === "maxLength" && (
          <p className="error">Description must be less than 255 characters</p>
        )}
        {errors.amount?.type === "maxLength" && (
          <p className="error">Amount must be less than 255 characters</p>
        )}
      </form>

      {message && (
        <Alert variant={message.includes("Error") ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
