# Security Specification - Pi Contest App

## 1. Data Invariants
- `name`: String, non-empty, max 100 chars.
- `correctDigits`: Number, non-negative integer.
- `accuracy`: Number, between 0 and 100.
- `time`: Number, positive.
- `createdAt`: Server-side timestamp.

## 2. Dirty Dozen Payloads
- P1: `{ "name": "", "correctDigits": 10 }` (Empty name)
- P2: `{ "name": "Test", "correctDigits": -5 }` (Negative digits)
- P3: `{ "name": "Test", "accuracy": 105 }` (Accuracy > 100)
- P4: `{ "name": "Test", "time": -10 }` (Negative time)
- P5: `{ "name": "Admin", "correctDigits": 1000000, "accuracy": 100 }` (Suspiciously high digits) - *Actually, we can't easily block this without anti-cheat.*
- P6: Injection attempt in name: `{ "name": "<script>alert(1)</script>" }`
- P7: Extra fields: `{ "name": "Test", "isVerified": true }`

## 3. Test Runner
(I will implement valid rules next)
