import Form, { FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { useMutation, useQuery } from "blitz"
import React from "react"
import toast from "react-hot-toast"
import updateSetting from "../mutations/updateSettings"
import getSettingsData from "../queries/getSetting"
import { Settingsform } from "../validations"

const SMTPPanel = () => {
  const [record] = useQuery(getSettingsData, null)

  const [updateSettings, { isLoading }] = useMutation(updateSetting)

  const onSubmit = async (values: any) => {
    try {
      await updateSettings({ ...values, smtpPort: Number(values.smtpPort) })
      toast.success("Settings are updated successfully!")
    } catch (error) {
      return {
        [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
      }
    }
  }

  return (
    <>
      <Form
        onSubmit={onSubmit}
        submitText="Save"
        schema={Settingsform}
        isLoading={isLoading}
        initialValues={{
          smtpHost: record ? record.smtpHost : undefined,
          smtpPort: record ? record.smtpPort + "" : undefined,
          smtpUsername: record ? record.smtpUsername : undefined,
          smtpPassword: record ? record.smtpPassword : undefined,
        }}
        noValidate
        smallButton
      >
        <LabeledTextField name="smtpHost" label="SMTP Host" placeholder="Enter SMTP Host" />
        <LabeledTextField
          name="smtpPort"
          label="SMTP Port"
          type="number"
          placeholder="Enter SMTP Port"
        />
        <LabeledTextField
          label="SMTP Username"
          name="smtpUsername"
          placeholder="Enter SMTP Username"
        />
        <LabeledTextField
          name="smtpPassword"
          label="SMTP Password"
          placeholder="Enter SMTP Password"
        />
      </Form>
    </>
  )
}

export default SMTPPanel
