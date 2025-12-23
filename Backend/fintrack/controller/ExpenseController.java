package com.fintrack.controller;

import com.fintrack.dto.ExpenseRequest;
import com.fintrack.dto.ExpenseResponse;
import com.fintrack.model.Expense;
import com.fintrack.model.User;
import com.fintrack.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(@AuthenticationPrincipal User user) {
        List<Expense> expenses = expenseService.getAllExpenses(user);
        List<ExpenseResponse> responses = expenses.stream()
            .map(ExpenseResponse::fromExpense)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id, 
                                                          @AuthenticationPrincipal User user) {
        Expense expense = expenseService.getExpenseById(id, user);
        return ResponseEntity.ok(ExpenseResponse.fromExpense(expense));
    }
    
    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request,
                                                         @AuthenticationPrincipal User user) {
        Expense expense = expenseService.createExpense(request, user);
        return ResponseEntity.ok(ExpenseResponse.fromExpense(expense));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id,
                                                         @Valid @RequestBody ExpenseRequest request,
                                                         @AuthenticationPrincipal User user) {
        Expense expense = expenseService.updateExpense(id, request, user);
        return ResponseEntity.ok(ExpenseResponse.fromExpense(expense));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, @AuthenticationPrincipal User user) {
        expenseService.deleteExpense(id, user);
        return ResponseEntity.ok().body(Map.of("message", "Expense deleted successfully"));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        List<Expense> expenses = expenseService.getExpensesByDateRange(user, startDate, endDate);
        List<ExpenseResponse> responses = expenses.stream()
            .map(ExpenseResponse::fromExpense)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(
            @PathVariable Expense.Category category,
            @AuthenticationPrincipal User user) {
        List<Expense> expenses = expenseService.getExpensesByCategory(user, category);
        List<ExpenseResponse> responses = expenses.stream()
            .map(ExpenseResponse::fromExpense)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/total")
    public ResponseEntity<Map<String, BigDecimal>> getTotalExpenses(@AuthenticationPrincipal User user) {
        BigDecimal total = expenseService.getTotalExpenses(user);
        return ResponseEntity.ok(Map.of("total", total));
    }
    
    @GetMapping("/total/date-range")
    public ResponseEntity<Map<String, BigDecimal>> getTotalExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        BigDecimal total = expenseService.getTotalExpensesByDateRange(user, startDate, endDate);
        return ResponseEntity.ok(Map.of("total", total));
    }
    
    @GetMapping("/category-summary")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryWiseExpenses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        Map<String, BigDecimal> categoryExpenses = expenseService.getCategoryWiseExpenses(user, startDate, endDate);
        return ResponseEntity.ok(categoryExpenses);
    }
}
