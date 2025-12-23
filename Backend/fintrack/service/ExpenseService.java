package com.fintrack.service;

import com.fintrack.dto.ExpenseRequest;
import com.fintrack.model.Expense;
import com.fintrack.model.User;
import com.fintrack.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    public List<Expense> getAllExpenses(User user) {
        return expenseRepository.findByUserOrderByExpenseDateDesc(user);
    }
    
    public Expense getExpenseById(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return expense;
    }
    
    public Expense createExpense(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setVendor(request.getVendor());
        
        return expenseRepository.save(expense);
    }
    
    public Expense updateExpense(Long id, ExpenseRequest request, User user) {
        Expense expense = getExpenseById(id, user);
        
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setVendor(request.getVendor());
        
        return expenseRepository.save(expense);
    }
    
    public void deleteExpense(Long id, User user) {
        Expense expense = getExpenseById(id, user);
        expenseRepository.delete(expense);
    }
    
    public List<Expense> getExpensesByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
            user, startDate, endDate);
    }
    
    public List<Expense> getExpensesByCategory(User user, Expense.Category category) {
        return expenseRepository.findByUserAndCategoryOrderByExpenseDateDesc(user, category);
    }
    
    public BigDecimal getTotalExpenses(User user) {
        BigDecimal total = expenseRepository.getTotalExpensesByUser(user);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalExpensesByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = expenseRepository.getTotalExpensesByUserAndDateRange(user, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public Map<String, BigDecimal> getCategoryWiseExpenses(User user, LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = expenseRepository.getCategoryWiseExpenses(user, startDate, endDate);
        Map<String, BigDecimal> categoryMap = new HashMap<>();
        
        for (Object[] result : results) {
            Expense.Category category = (Expense.Category) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            categoryMap.put(category.name(), amount);
        }
        
        return categoryMap;
    }
}
