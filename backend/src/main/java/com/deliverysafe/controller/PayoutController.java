package com.deliverysafe.controller;

import com.deliverysafe.dto.WeatherRequest;
import com.deliverysafe.model.Payout;
import com.deliverysafe.model.User;
import com.deliverysafe.repository.PayoutRepository;
import com.deliverysafe.repository.UserRepository;
import com.deliverysafe.service.RiskDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PayoutController {

    @Autowired
    private RiskDetectionService riskDetectionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @PostMapping("/users/init")
    public User initUser() {
        if (userRepository.count() == 0) {
            User user = new User();
            user.setName("Demo User");
            user.setHourlyEarnings(80.0);
            user.setWorkingHoursPerDay(4.0);
            return userRepository.save(user);
        }
        return userRepository.findAll().get(0);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{id}/weather")
    public ResponseEntity<Payout> reportWeather(@PathVariable Long id, @RequestBody WeatherRequest request) {
        Optional<Payout> payout = riskDetectionService.processWeather(id, request);
        return payout.map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/users/{id}/payouts")
    public List<Payout> getPayouts(@PathVariable Long id) {
        return payoutRepository.findByUserIdOrderByTimestampDesc(id);
    }
}
