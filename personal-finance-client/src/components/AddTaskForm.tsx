import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { AddTaskFormProps, TaskFormData } from "../utils/types";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup.date().nullable().transform((value) => value || undefined),
  status: yup.string().oneOf(["pending", "completed"]).default("pending")
});

const AddTaskForm: React.FC<AddTaskFormProps> = ({ open, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      status: 'pending',
    },
  });

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    onSave(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} >
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          {...register('dueDate')}
          error={!!errors.dueDate}
          helperText={errors.dueDate?.message}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AddTaskForm;
