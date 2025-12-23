package com.fintrack.dto;

import com.fintrack.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private Expense.Category category;
    private LocalDate expenseDate;
    private Expense.PaymentMethod paymentMethod;
    private String vendor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ExpenseResponse fromExpense(Expense expense) {
        return new ExpenseResponse(
            expense.getId(),
            expense.getTitle(),
            expense.getDescription(),
            expense.getAmount(),
            expense.getCategory(),
            expense.getExpenseDate(),
            expense.getPaymentMethod(),
            expense.getVendor(),
            expense.getCreatedAt(),
            expense.getUpdatedAt()
        );
    }
}
