# Masidy AI - API Documentation

For developers integrating with Masidy or extending functionality.

## Base URL

```
https://api.masidy.ai
```

For local development:
```
http://localhost:3000/api
```

## Authentication

All requests require a session token in the Authorization header:

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

Obtain tokens via the login endpoint or from your user dashboard.

## API Endpoints

### 1. Get Available Models

**Endpoint**: `GET /api/models`

**Description**: Retrieve all available AI models

**Response**:
```json
{
  "models": [
    {
      "id": "masidy-pro",
      "name": "Masidy Pro",
      "description": "General purpose AI",
      "speed": "fast",
      "creativity": "balanced"
    },
    {
      "id": "masidy-research",
      "name": "Masidy Research",
      "description": "In-depth analysis",
      "speed": "slower",
      "creativity": "analytical"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

### 2. Send Message

**Endpoint**: `POST /api/chat`

**Description**: Send a message and receive AI response

**Request Body**:
```json
{
  "message": "What is machine learning?",
  "model": "masidy-tutor",
  "conversation_id": "conv-abc123",
  "attachments": [
    {
      "type": "file",
      "url": "https://..."
    }
  ]
}
```

**Parameters**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| message | string | Yes | Your message (max 10,000 chars) |
| model | string | Yes | Model ID from `/api/models` |
| conversation_id | string | No | Continue existing chat, or create new |
| attachments | array | No | Files for context |

**Response**:
```json
{
  "id": "msg-xyz789",
  "response": "Machine learning is...",
  "conversation_id": "conv-abc123",
  "model_used": "masidy-tutor",
  "processing_time_ms": 1250,
  "tokens_used": 156,
  "created_at": "2026-05-28T10:30:00Z"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized
- `429`: Rate limited
- `500`: Server error

**Rate Limiting**:
- Free tier: 15 requests/minute
- Pro tier: 100 requests/minute
- Enterprise: Custom limits

---

### 3. Get Conversations

**Endpoint**: `GET /api/conversations`

**Description**: Retrieve all user conversations

**Query Parameters**:
| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| limit | int | 50 | Max conversations to return |
| offset | int | 0 | Pagination offset |
| sort | string | recent | Sort by: recent, oldest, title |

**Response**:
```json
{
  "conversations": [
    {
      "id": "conv-abc123",
      "title": "Python Basics",
      "created_at": "2026-05-28T09:00:00Z",
      "updated_at": "2026-05-28T10:30:00Z",
      "message_count": 12,
      "last_model": "masidy-code"
    }
  ],
  "total": 23,
  "limit": 50,
  "offset": 0
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

### 4. Get Conversation Details

**Endpoint**: `GET /api/conversations/{conversation_id}`

**Description**: Retrieve full conversation history

**Response**:
```json
{
  "id": "conv-abc123",
  "title": "Python Basics",
  "messages": [
    {
      "id": "msg-001",
      "role": "user",
      "content": "How do I start learning Python?",
      "timestamp": "2026-05-28T09:00:00Z"
    },
    {
      "id": "msg-002",
      "role": "assistant",
      "content": "Great question! Here are the fundamentals...",
      "model": "masidy-tutor",
      "timestamp": "2026-05-28T09:01:00Z"
    }
  ],
  "created_at": "2026-05-28T09:00:00Z"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: Conversation not found
- `500`: Server error

---

### 5. Delete Conversation

**Endpoint**: `DELETE /api/conversations/{conversation_id}`

**Description**: Permanently delete a conversation

**Response**:
```json
{
  "status": "success",
  "deleted_id": "conv-abc123",
  "message": "Conversation deleted"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: Conversation not found
- `500`: Server error

---

### 6. Create New Conversation

**Endpoint**: `POST /api/conversations`

**Description**: Start a new conversation thread

**Request Body**:
```json
{
  "title": "Python Basics",
  "initial_message": "How do I start learning Python?"
}
```

**Response**:
```json
{
  "id": "conv-xyz789",
  "title": "Python Basics",
  "created_at": "2026-05-28T10:30:00Z"
}
```

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized
- `500`: Server error

---

## Error Handling

All errors return consistent format:

```json
{
  "error": true,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Try again in 30 seconds.",
  "timestamp": "2026-05-28T10:30:00Z"
}
```

**Common Error Codes**:
| Code | HTTP | Meaning |
|------|------|---------|
| INVALID_REQUEST | 400 | Malformed request |
| UNAUTHORIZED | 401 | Missing/invalid token |
| NOT_FOUND | 404 | Resource doesn't exist |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

Rate limits reset every minute.

**Headers returned**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1685270400
```

When limit reached, retry after `X-RateLimit-Reset` timestamp.

---

## Webhooks (Pro+ Plans)

Subscribe to events:

**Subscribe**:
```
POST /api/webhooks/subscribe
{
  "url": "https://yoursite.com/webhook",
  "events": ["message.received", "conversation.created"]
}
```

**Events**:
- `message.received` - New message from AI
- `conversation.created` - New conversation started
- `conversation.deleted` - Conversation removed

**Webhook Payload**:
```json
{
  "event": "message.received",
  "timestamp": "2026-05-28T10:30:00Z",
  "data": {
    "message_id": "msg-xyz789",
    "conversation_id": "conv-abc123",
    "content": "The response..."
  }
}
```

---

## Integration Examples

### Python
```python
import requests

headers = {"Authorization": f"Bearer {token}"}

# Send message
response = requests.post(
    "https://api.masidy.ai/api/chat",
    headers=headers,
    json={
        "message": "What is AI?",
        "model": "masidy-pro"
    }
)

result = response.json()
print(result["response"])
```

### JavaScript
```javascript
const response = await fetch('https://api.masidy.ai/api/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'What is AI?',
    model: 'masidy-pro'
  })
});

const data = await response.json();
console.log(data.response);
```

### cURL
```bash
curl -X POST https://api.masidy.ai/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is AI?",
    "model": "masidy-pro"
  }'
```

---

## Best Practices

1. **Cache Responses**: Store common questions/answers locally
2. **Retry Logic**: Implement exponential backoff for failures
3. **Rate Limit Handling**: Respect rate limit headers
4. **Error Handling**: Always check error responses
5. **Security**: Never expose tokens in client-side code
6. **Conversations**: Reuse conversation IDs for context
7. **Monitoring**: Track API usage and latency

---

## Changelog

### v1.0.0 (Current)
- Initial API launch
- 5 models available
- Message, conversation management
- Rate limiting

### Roadmap
- Custom model fine-tuning
- Batch processing
- Real-time streaming responses
- Advanced analytics

---

## Support

- **Documentation**: https://docs.masidy.ai
- **Status**: https://status.masidy.ai
- **Email**: api-support@masidy.ai
- **Community**: https://community.masidy.ai

---

**API Version**: 1.0.0  
**Last Updated**: May 2026
