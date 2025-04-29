import React, {useEffect, useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Alert, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddTaskFormProps, TaskFormData } from "../utils/types";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup.date().nullable().transform((value) => value || undefined),
  status: yup.string().oneOf(["pending", "completed"]).default("pending")
});

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onClose, onSave, task }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit,setValue, 
    formState: { errors }, reset } = useForm<TaskFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      status: 'pending',
      title: "",
      description: "",
      dueDate: null,
    },
  });

    useEffect(() => {
      console.log("task", task);
      if (task) {
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("dueDate", task.dueDate ? new Date(task.dueDate) : null);
      }
    }, [task, setValue]);

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
      try {
        setIsSubmitting(true);
        setError(null);
        if (onSave) {
          onSave(data);
        }
        reset();
      } catch (err) {
        console.error("Error adding task:", err);
        setError("Failed to add task. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleCancel = () => {
    reset(); 
    setError(null); 
    if (onClose) {
      onClose(); 
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} 
    sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      <Typography variant="h5" sx={{ mb: 2 }}>  {task ? "Update Task" : "Add New Task"}
      </Typography>

      <IconButton 
        aria-label="close" 
        onClick={handleCancel} 
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

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
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Add Task"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTaskForm;
