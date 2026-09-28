# Frontend to Backend Data Contract

Documentation of the data sent from the frontend to the backend.

---

## 1. Resume Analysis (`POST /analyse`)

- **Endpoint**: `/analyse`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Payload Fields

| Field | Source | Type | Required | Constraints / Allowed Values | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `resume` | `req.file` | Binary File | Yes | MIME: `application/pdf`<br>Max size: `10MB` | Resume PDF file |
| `company` | `req.body` | String | Yes | Min: `1` char, Max: `100` chars (trimmed) | Target company & role |
| `recipient` | `req.body` | String (enum) | Yes | `founder`<br>`eng_manager`<br>`recruiter`<br>`peer` | Target outreach recipient persona |
| `tone` | `req.body` | String (enum) | Yes | `punchy`<br>`metric_heavy`<br>`conversational` | Email pitch tone preset |

### Example Request (`FormData`)

```javascript
const formData = new FormData();
formData.append("resume", pdfFile); // File instance (.pdf, max 10MB)
formData.append("company", "Linear — Senior Product Engineer");
formData.append("recipient", "founder");
formData.append("tone", "punchy");

await axios.post("http://localhost:3000/analyse", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Backend Responses

#### Success (`200 OK`)
```json
{
  "success": true,
  "message": "Resume uploaded and analyzed successfully",
  "file": {
    "name": "resume.pdf",
    "type": "application/pdf",
    "size": 253952
  },
  "text": "Extracted text content from resume..."
}
```

#### Validation Error (`400 Bad Request`)
```json
{
  "error": "Invalid recipient type"
}
```

---

## 2. Health Check (`GET /`)

- **Endpoint**: `/`
- **Method**: `GET`
- **Payload**: None
- **Response**: `200 OK` (`"Working"`)
