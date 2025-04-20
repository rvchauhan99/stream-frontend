# 📘 API Specification Document

## Project: OTT Video Streaming Platform

## 🛠️ Stack Overview
- **Backend:** Node.js (Express)
- **Database:** MongoDB
- **Cache:** Redis
- **Queue:** Bull
- **Storage:** S3-compatible
- **CDN:** Cost-effective solution
- **Streaming:** HLS

## 📌 API Modules & Specifications

### 1. Auth & User Management

#### Endpoints
- `POST /auth/signup`
  - Request body validation
  - Email verification
  - Password hashing
  - Role assignment (default as viewer)

- `POST /auth/login`
  - JWT token generation
  - Session management
  - Device tracking
  - Rate limiting

- `POST /auth/logout`
  - Token invalidation
  - Session cleanup
  - Device removal

- `POST /auth/refresh-token`
  - Token refresh logic
  - Security validation
  - Session extension

- `GET /users/me`
  - Profile data
  - Preferences
  - Subscription status
  - Watch history

- `PATCH /users/me`
  - Profile update
  - Preference changes
  - Notification settings
  - Privacy controls

#### User Schema
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "enum['viewer', 'creator', 'admin', 'staff']",
  "profileImage": "string",
  "subscriptions": [{
    "planId": "string",
    "startDate": "date",
    "endDate": "date",
    "status": "enum['active', 'cancelled', 'expired']"
  }],
  "devices": ["string"],
  "preferences": {
    "quality": "enum['auto', '1080p', '720p', '480p']",
    "notifications": "boolean",
    "autoplay": "boolean"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

### 2. Video Content Management

#### Endpoints
- `POST /videos`
  - Chunked upload
  - Metadata validation
  - Thumbnail generation
  - Processing queue

- `GET /videos`
  - Pagination
  - Filtering
  - Sorting
  - Search

- `GET /videos/:id`
  - Video details
  - Stream URLs
  - Related content
  - Engagement data

- `PUT /videos/:id`
  - Metadata update
  - Visibility changes
  - Monetization update
  - Content replacement

- `DELETE /videos/:id`
  - Soft delete
  - Storage cleanup
  - CDN purge
  - Analytics update

#### Video Schema
```json
{
  "_id": "ObjectId",
  "creatorId": "ObjectId",
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "visibility": "enum['public', 'private', 'scheduled']",
  "monetization": {
    "type": "enum['free', 'subscription', 'pay_per_view', 'ad_supported']",
    "price": "number",
    "currency": "string",
    "adConfig": {
      "preRoll": "boolean",
      "midRoll": "boolean",
      "postRoll": "boolean",
      "frequency": "number"
    }
  },
  "drmEnabled": "boolean",
  "geoRestrictions": ["string"],
  "filePath": "string",
  "thumbnailPath": "string",
  "duration": "number",
  "qualities": {
    "1080p": "string",
    "720p": "string",
    "480p": "string"
  },
  "stats": {
    "views": "number",
    "likes": "number",
    "comments": "number",
    "shares": "number",
    "watchTime": "number"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

**COmment **
``` 
  "comments": [{
    "videoId":"ObjectId"
    "userId": "ObjectId",
    "text": "string",
    "timestamp": "date",
    "likes": "number",
    "replies": ["ObjectId"]
  }],

### 3. Monetization

#### Endpoints
- `GET /revenue/creator/:creatorId`
  - Revenue breakdown
  - Payment history
  - Analytics data
  - Payout status

- `POST /payments/subscribe`
  - Plan selection
  - Payment processing
  - Subscription creation
  - Receipt generation

- `POST /payments/ppv`
  - Video purchase
  - Payment processing
  - Access grant
  - Receipt generation

- `GET /payments/history`
  - Transaction list
  - Filtering options
  - Export capability
  - Tax information

#### Transaction Schema
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "creatorId": "ObjectId",
  "videoId": "ObjectId",
  "type": "enum['subscription', 'ppv', 'ad_revenue']",
  "amount": "number",
  "currency": "string",
  "status": "enum['pending', 'completed', 'failed', 'refunded']",
  "paymentMethod": "string",
  "taxInfo": {
    "amount": "number",
    "rate": "number",
    "country": "string"
  },
  "metadata": "object",
  "timestamp": "date"
}
```

### 4. Analytics

#### Endpoints
- `GET /analytics/videos/:videoId`
  - Viewership data
  - Engagement metrics
  - Revenue analytics
  - Audience insights

- `GET /analytics/creator/:creatorId`
  - Channel performance
  - Revenue trends
  - Audience growth
  - Content analysis

- `GET /analytics/user/:userId`
  - Watch history
  - Preference analysis
  - Engagement patterns
  - Recommendation data

#### Analytics Schema
```json
{
  "_id": "ObjectId",
  "videoId": "ObjectId",
  "userId": "ObjectId",
  "creatorId": "ObjectId",
  "metrics": {
    "views": "number",
    "watchTime": "number",
    "engagement": {
      "likes": "number",
      "comments": "number",
      "shares": "number",
      "completionRate": "number"
    },
    "quality": {
      "bufferHealth": "number",
      "bitrate": "number",
      "resolution": "string"
    },
    "revenue": {
      "amount": "number",
      "type": "string",
      "currency": "string"
    }
  },
  "timestamp": "date"
}
```

### 5. Uploads & Storage

#### Endpoints
- `POST /upload/video`
  - Chunked upload
  - Progress tracking
  - Validation
  - Storage optimization

- `POST /upload/thumbnail`
  - Image processing
  - Format conversion
  - Size optimization
  - CDN distribution

### 6. DRM & Security

#### Endpoints
- `GET /stream/:videoId`
  - DRM token generation
  - Access validation
  - Quality selection
  - CDN routing

### 7. Discovery & Recommendation

#### Endpoints
- `GET /feed/trending`
  - Popular content
  - Time-based ranking
  - Category filtering
  - Personalization

- `GET /feed/recommended`
  - User preferences
  - Watch history
  - Similar content
  - Fresh content

- `GET /feed/categories`
  - Category list
  - Popular videos
  - New releases
  - Featured content

- `GET /search`
  - Text search
  - Filter options
  - Sort capabilities
  - Faceted search

## ✅ Non-Functional Requirements

### Performance
- Response time < 200ms
- Throughput: 1000 req/s
- Concurrent users: 10,000+
- Video start time < 2s

### Security
- HTTPS everywhere
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

### Scalability
- Horizontal scaling
- Load balancing
- Caching strategy
- Database sharding
- CDN distribution

### Monitoring
- Error tracking
- Performance metrics
- User analytics
- System health
- Cost monitoring

### Documentation
- OpenAPI/Swagger
- Example requests
- Response formats
- Authentication
- Rate limits

