package com.fintrack.controller;

import com.fintrack.model.User;
import com.fintrack.service.AIAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {
    
    @Autowired
    private AIAnalysisService aiAnalysisService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getExpenseAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal User user) {
        Map<String, Object> analysis = aiAnalysisService.generateExpenseAnalysis(user, startDate, endDate);
        return ResponseEntity.ok(analysis);
    }
}
