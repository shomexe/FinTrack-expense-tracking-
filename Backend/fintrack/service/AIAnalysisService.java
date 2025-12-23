package com.fintrack.service;

import com.fintrack.model.Expense;
import com.fintrack.model.User;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIAnalysisService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Autowired
    private ExpenseService expenseService;
    
    public Map<String, Object> generateExpenseAnalysis(User user, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseService.getExpensesByDateRange(user, startDate, endDate);
        BigDecimal totalExpenses = expenseService.getTotalExpensesByDateRange(user, startDate, endDate);
        Map<String, BigDecimal> categoryWiseExpenses = expenseService.getCategoryWiseExpenses(user, startDate, endDate);
        
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalExpenses", totalExpenses);
        analysis.put("expenseCount", expenses.size());
        analysis.put("categoryBreakdown", categoryWiseExpenses);
        analysis.put("startDate", startDate);
        analysis.put("endDate", endDate);
        
        // Calculate average
        if (!expenses.isEmpty()) {
            BigDecimal average = totalExpenses.divide(
                BigDecimal.valueOf(expenses.size()), 2, BigDecimal.ROUND_HALF_UP);
            analysis.put("averageExpense", average);
        } else {
            analysis.put("averageExpense", BigDecimal.ZERO);
        }
        
        // Find top category
        String topCategory = categoryWiseExpenses.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");
        analysis.put("topCategory", topCategory);
        
        // Generate AI insights
        try {
            String aiInsights = generateAIInsights(expenses, totalExpenses, categoryWiseExpenses, startDate, endDate);
            analysis.put("aiInsights", aiInsights);
        } catch (Exception e) {
            analysis.put("aiInsights", "AI insights unavailable. Please configure your OpenAI API key.");
        }
        
        return analysis;
    }
    
    private String generateAIInsights(List<Expense> expenses, BigDecimal totalExpenses, 
                                     Map<String, BigDecimal> categoryWiseExpenses,
                                     LocalDate startDate, LocalDate endDate) {
        
        // Check if API key is configured
        if (apiKey == null || apiKey.equals("your_openai_api_key_here")) {
            return generateBasicInsights(expenses, totalExpenses, categoryWiseExpenses, startDate, endDate);
        }
        
        try {
            OpenAiService service = new OpenAiService(apiKey);
            
            String prompt = buildPrompt(expenses, totalExpenses, categoryWiseExpenses, startDate, endDate);
            
            ChatCompletionRequest chatRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(
                    new ChatMessage(ChatMessageRole.SYSTEM.value(), 
                        "You are a financial advisor providing insights on expense patterns."),
                    new ChatMessage(ChatMessageRole.USER.value(), prompt)
                ))
                .maxTokens(500)
                .temperature(0.7)
                .build();
            
            return service.createChatCompletion(chatRequest)
                .getChoices().get(0).getMessage().getContent();
                
        } catch (Exception e) {
            return generateBasicInsights(expenses, totalExpenses, categoryWiseExpenses, startDate, endDate);
        }
    }
    
    private String buildPrompt(List<Expense> expenses, BigDecimal totalExpenses,
                              Map<String, BigDecimal> categoryWiseExpenses,
                              LocalDate startDate, LocalDate endDate) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Analyze the following expense data and provide insights:\n\n");
        prompt.append("Period: ").append(startDate.format(DateTimeFormatter.ISO_DATE))
              .append(" to ").append(endDate.format(DateTimeFormatter.ISO_DATE)).append("\n");
        prompt.append("Total Expenses: ₹").append(totalExpenses).append("\n");
        prompt.append("Number of Transactions: ").append(expenses.size()).append("\n\n");
        prompt.append("Category Breakdown:\n");
        
        categoryWiseExpenses.forEach((category, amount) -> 
            prompt.append("- ").append(category).append(": ₹").append(amount).append("\n")
        );
        
        prompt.append("\nProvide:\n");
        prompt.append("1. Key spending patterns\n");
        prompt.append("2. Areas where spending could be reduced\n");
        prompt.append("3. Budget recommendations\n");
        prompt.append("4. Any concerning trends\n");
        
        return prompt.toString();
    }
    
    private String generateBasicInsights(List<Expense> expenses, BigDecimal totalExpenses,
                                        Map<String, BigDecimal> categoryWiseExpenses,
                                        LocalDate startDate, LocalDate endDate) {
        StringBuilder insights = new StringBuilder();
        insights.append("📊 Expense Summary\n\n");
        
        insights.append("During this period, you spent a total of ₹")
                .append(totalExpenses).append(" across ")
                .append(expenses.size()).append(" transactions.\n\n");
        
        if (!categoryWiseExpenses.isEmpty()) {
            String topCategory = categoryWiseExpenses.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
            BigDecimal topAmount = categoryWiseExpenses.get(topCategory);
            
            insights.append("💰 Your highest spending category is ")
                    .append(topCategory).append(" with ₹").append(topAmount).append(".\n\n");
            
            BigDecimal percentage = topAmount.multiply(BigDecimal.valueOf(100))
                .divide(totalExpenses, 2, BigDecimal.ROUND_HALF_UP);
            
            if (percentage.compareTo(BigDecimal.valueOf(40)) > 0) {
                insights.append("⚠️ Alert: ").append(topCategory)
                        .append(" represents ").append(percentage)
                        .append("% of your total spending. Consider reviewing this category.\n\n");
            }
        }
        
        if (!expenses.isEmpty()) {
            BigDecimal average = totalExpenses.divide(
                BigDecimal.valueOf(expenses.size()), 2, BigDecimal.ROUND_HALF_UP);
            insights.append("📈 Average transaction: ₹").append(average).append("\n\n");
        }
        
        insights.append("💡 Tip: Track your expenses regularly to identify patterns and save more!");
        
        return insights.toString();
    }
}
