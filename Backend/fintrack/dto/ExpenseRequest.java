package com.fintrack.dto;

import com.fintrack.model.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Category is required")
    private Expense.Category category;
    
    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;
    
    @NotNull(message = "Payment method is required")
    private Expense.PaymentMethod paymentMethod;
    
    private String vendor;
}
