package com.fintrack.repository;

import com.fintrack.model.Expense;
import com.fintrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByExpenseDateDesc(User user);
    
    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
        User user, LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByUserAndCategoryOrderByExpenseDateDesc(
        User user, Expense.Category category);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user")
    BigDecimal getTotalExpensesByUser(@Param("user") User user);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByUserAndDateRange(
        @Param("user") User user,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user = :user " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate GROUP BY e.category")
    List<Object[]> getCategoryWiseExpenses(
        @Param("user") User user,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}
