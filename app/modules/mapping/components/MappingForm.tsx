import Form, { FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { useMutation, useQuery } from "blitz"
import React from "react"
import toast from "react-hot-toast"
import updateMapping from "../mutations/updateMapping"
import getMapping from "../queries/getMapping"
import { MappingSourceType } from "../types/Mapping.types"
import { MappingSchema } from "../validations"

interface MappingFormProps {
  source: MappingSourceType
}

const MappingForm = ({ source }: MappingFormProps) => {
  const [mapping, { refetch }] = useQuery(getMapping, source)

  const [mutateUpdateMapping, { isLoading }] = useMutation(updateMapping)

  const onSubmit = async (values: any) => {
    try {
      await mutateUpdateMapping({
        ...values,
        mappedTo: source,
      })
      refetch()
      toast.success("Mapping is updated successfully!")
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
        onError={(e) => {
          console.log(e)
        }}
        onErrorCapture={(e) => {
          console.log(e)
        }}
        submitText="Save"
        schema={MappingSchema}
        isLoading={isLoading}
        initialValues={mapping ? mapping : undefined}
        noValidate
        smallButton
      >
        <LabeledTextField
          name="underwriterClassId"
          label="Underwriter Class Id"
          placeholder="Enter underwriterClassId attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="name"
          label="Name"
          placeholder="Enter name attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="brand"
          label="Brand"
          placeholder="Enter brand attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="description"
          label="Description"
          placeholder="Enter description attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="variant"
          label="Variant"
          placeholder="Enter variant attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="manufactureDate"
          label="Manufacture Date"
          placeholder="Enter manufactureDate attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        <LabeledTextField
          name="assetValue"
          label="Asset Value"
          placeholder="Enter assetValue attribute mapping"
          type={source === "HARRODS" ? "text" : "select"}
        />
        {/* <LabeledTextField
          name="currency"
          label="Currency"
          placeholder="Enter currency attribute mapping"
          type="select"
        /> */}
      </Form>
    </>
  )
}

export default MappingForm
