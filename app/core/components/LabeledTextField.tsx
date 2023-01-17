import { FormHelperText, Select } from "@material-ui/core"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/styles"
import { forwardRef, PropsWithoutRef } from "react"
import { Controller, useFormContext } from "react-hook-form"
const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))
export interface LabeledTextFieldProps extends PropsWithoutRef<TextFieldProps> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "select"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ label, outerProps, name, type, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
      control,
    } = useFormContext()
    const error = Array.isArray(errors[name])
      ? errors[name].join(", ")
      : errors[name]?.message || errors[name]

    const classes = useStyles()

    const selectData = [
      "",
      "name",
      "salePrice",
      "sku",
      "upc",
      "manufacturer",
      "description",
      "shortDescription",
      "longDescription",
      "color",
      "releaseDate",
      "categoryPath",
      "condition",
      "dollarSavings",
      "modelNumber",
      "type",
    ]

    return (
      <div {...outerProps}>
        {type === "select" ? (
          <FormControl variant="outlined" className={classes.formControl} error={!!error}>
            <InputLabel id={name}>{name}</InputLabel>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Select
                  native
                  label={label}
                  labelId={name}
                  id={name}
                  disabled={isSubmitting}
                  variant="outlined"
                  required
                  fullWidth
                  autoComplete={name}
                  {...field}
                >
                  {selectData.map((select, index) => {
                    return (
                      <option key={index} value={select}>
                        {select}
                      </option>
                    )
                  })}
                </Select>
              )}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        ) : (
          <TextField
            type={type ? type : "string"}
            disabled={isSubmitting}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id={name}
            label={label}
            autoComplete={name}
            error={!!error}
            helperText={error && error}
            {...register(name)}
            {...props}
          />
        )}
      </div>
    )
  }
)

export default LabeledTextField
