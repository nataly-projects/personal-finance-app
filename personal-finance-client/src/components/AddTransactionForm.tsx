import React, {useState, useEffect} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Box, Alert, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API from "../services/api.js";
import {categories} from "../utils/utils.js";
import { AddTransactionFormProps, Category, TransactionFormData } from '../utils/types.js';



const transactionSchema = yup.object().shape({
  amount: yup.number().required("Amount is required").positive("Amount must be positive"),
  category: yup.string().required("Category is required"),
  type: yup.string().oneOf(["income", "expense"], "Type is invalid").required("Type is required"),
  date: yup.date().required("Date is required"),
  description: yup.string().default("").required("Description is required"),
});

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSuccess, handleClose, transaction }) => {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([...categories]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema) as any,
    defaultValues: {
      amount: 0,
      category: "",
      type: null,
      date: null,
      description: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedType = watch("type");
  const selectedDate = watch("date");
  
  useEffect(() => {
    if (transaction) {
      // Populate form fields with transaction data
      setValue("amount", transaction.amount);
      setValue("category", transaction.category);
      setValue("type", transaction?.type || "expense");
      setValue("date", new Date(transaction.date));
      setValue("description", transaction.description);
    }
    const fetchCategories = async () => {
      try {
        const response = await API.get<Category[]>("/categories");
        const userCategories = response.data.map((category) => category.name);
        const combinedCategories = Array.from(new Set<string>([...customCategories, ...userCategories]));
        setCustomCategories(combinedCategories);     
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, [transaction, setValue]);

  const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      // await API.post("/transactions", data);
      // reset();
      if (onSuccess) {
        onSuccess(data);
      }
      
      reset();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset(); 
    setError(null); 
    if(handleClose) {
      handleClose(); 
    }
  };

  return (
    <Box 
      component="form" 
      id="add-transaction-form"
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
      <Typography variant="h5" sx={{ mb: 2 }}>        {transaction ? "Update Transaction" : "Add New Transaction"}
      </Typography>
  
        
      <IconButton 
        aria-label="close" 
        onClick={handleCancel} 
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <TextField
        label="Amount"
        type="number"
        {...register("amount", { valueAsNumber: true })}
        error={!!errors.amount}
        helperText={errors.amount?.message}
        fullWidth
      />

      <TextField
        select
        label="Category"
        {...register("category")}
        error={!!errors.category}
        helperText={errors.category?.message}
        fullWidth
        value={selectedCategory}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "add-custom-category") {
            setIsCustomCategory(true);
            setValue("category", ""); 
          } else {
            setIsCustomCategory(false);
            setValue("category", value); 
          }
        }}
      >
        {customCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
        <MenuItem value="add-custom-category">Add New Category</MenuItem>
      </TextField>

      {isCustomCategory && (
        <TextField
          label="Custom Category"
          placeholder="Enter your new category"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
          fullWidth
          required
        />
      )}

      <TextField
        select
        label="Transaction Type"
        {...register("type")}
        error={!!errors.type}
        helperText={errors.type?.message}
        fullWidth
        value={selectedType}
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>

      <TextField
        label="Date"
        type="date"
        {...register("date")}
        error={!!errors.date}
        helperText={errors.date?.message}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={2}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : transaction ? "Update Transaction" : "Add Transaction"}
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddTransactionForm;
