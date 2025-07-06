# Token-Based Messaging System Guide

## Overview

This freelancing platform implements a token-based system where users must spend tokens to interact with jobs and communicate with other users. This system ensures quality interactions and prevents spam while monetizing the platform.

## How It Works

### 1. Token Allocation
- **New Users**: Receive 5 tokens automatically upon signup
- **Token Usage**: Users spend tokens for platform interactions
- **Token Purchases**: Users can buy additional tokens when needed

### 2. Token Requirements

| Action | Token Cost | Description |
|--------|------------|-------------|
| Apply for Job | 1 token | Deducted when applying for any job |
| Upload Job | 1 token | Deducted when posting a new job |
| Message Job Owner | 0 tokens* | *Must have applied first (spent 1 token) |

### 3. Messaging System Rules

#### For Freelancers:
- ✅ **Can message**: Only after applying for a job (spending 1 token)
- ❌ **Cannot message**: Without applying first
- 🔒 **Blocked**: Will see "Apply First to Message" prompt

#### For Job Owners:
- ✅ **Can message**: Any freelancer who has applied to their job
- ✅ **No restrictions**: Job owners can always respond to messages

## User Flow Examples

### Example 1: New Freelancer
1. Signs up → Gets 5 tokens
2. Browses jobs → Finds interesting job
3. Tries to message job owner → **Blocked** (must apply first)
4. Applies for job → Spends 1 token (4 remaining)
5. Can now message job owner → **Allowed**

### Example 2: Job Owner
1. Posts a job → Spends 1 token
2. Receives applications → Gets notifications
3. Freelancers can message → **Automatic access**
4. Can respond to all messages → **No restrictions**

### Example 3: Out of Tokens
1. User has 0 tokens → Cannot apply or post
2. Tries to apply → **Blocked** with token purchase prompt
3. Buys tokens → Can resume activities

## Technical Implementation

### Backend Features
- **Token Management**: `backend/tokens.js`
- **Job Applications**: `backend/jobApplications.js`
- **Messaging Control**: `backend/messages.js`
- **User Schema**: Updated with token fields

### Frontend Features
- **Token Dashboard**: `/tokens` page
- **Balance Display**: Header shows current token count
- **Purchase Flow**: Integrated token purchasing
- **Messaging Blocks**: Prevents unauthorized messaging

### Database Schema
```javascript
User: {
  username: String,
  tokens: { type: Number, default: 5 },
  tokenHistory: [{
    type: String, // 'add' or 'deduct'
    amount: Number,
    purpose: String,
    timestamp: Date
  }]
}
```

## API Endpoints

### Token Management
- `POST /tokens/balance` - Get user token balance
- `POST /tokens/history` - Get token transaction history
- `POST /tokens/purchase` - Purchase tokens

### Job Applications
- `POST /jobs/apply` - Apply for job (requires 1 token)
- `POST /messages/check-eligibility` - Check if user can message

### Messaging
- `POST /messages` - Send message (checks eligibility)
- `POST /messages1` - Get/send messages (checks eligibility)

## Error Handling

### Insufficient Tokens
```javascript
{
  "message": "Insufficient tokens. You need 1 token to apply for a job.",
  "required": 1,
  "action": "purchase_tokens"
}
```

### Messaging Not Allowed
```javascript
{
  "message": "You must apply for this job first before messaging the job owner.",
  "action": "apply_first"
}
```

## Security Features

1. **Token Verification**: All token operations are verified server-side
2. **Authentication**: All token endpoints require valid JWT tokens
3. **Double-Spend Prevention**: Token deduction is atomic
4. **Audit Trail**: Complete token history tracking

## User Experience

### Visual Indicators
- Token count in header
- Purchase prompts when tokens are low
- Clear messaging about requirements
- Elegant "Apply First" screens

### Navigation Flow
- Blocked actions redirect to appropriate solutions
- Token purchase page easily accessible
- Clear application flow before messaging

## Testing Scenarios

### Test Case 1: New User Journey
1. Register new account
2. Verify 5 tokens granted
3. Try to message without applying
4. Apply for job (1 token deducted)
5. Message now works

### Test Case 2: Token Exhaustion
1. Use all tokens
2. Try to apply for job
3. Get purchase prompt
4. Buy tokens
5. Application works

### Test Case 3: Job Owner Flow
1. Post job (1 token deducted)
2. Receive applications
3. Message any applicant
4. No restrictions on messaging

## Benefits

### For Users
- **Quality Control**: Reduces spam and low-quality interactions
- **Fair System**: Everyone starts with free tokens
- **Clear Rules**: Transparent token requirements

### For Platform
- **Monetization**: Revenue from token sales
- **Engagement**: Encourages thoughtful applications
- **Scalability**: Sustainable growth model

## Future Enhancements

1. **Token Packages**: Different token bundle sizes
2. **Subscription Model**: Monthly token allowances
3. **Referral Rewards**: Bonus tokens for referrals
4. **Achievement System**: Free tokens for milestones
5. **Premium Features**: Additional token-based features

## Troubleshooting

### Common Issues
1. **"Can't message"**: User hasn't applied for the job
2. **"Insufficient tokens"**: User needs to purchase more tokens
3. **"Application failed"**: Check token balance

### Solutions
1. Apply for job first before messaging
2. Visit `/tokens` page to purchase tokens
3. Check token balance in header

## Support

For technical issues or questions about the token system, please check:
1. Token balance in header
2. Transaction history on `/tokens` page
3. Error messages for specific guidance

---

*This token system ensures a high-quality freelancing platform while maintaining fairness and preventing abuse.*
