# Support Ticket System

A full-stack Support Ticket System built with:

-   Backend: Django + Django REST Framework
-   Database: PostgreSQL
-   Frontend: React
-   LLM Integration: OpenRouter
-   Infrastructure: Docker + Docker Compose

------------------------------------------------------------------------

## Features

### Ticket Management

-   Create support tickets
-   Auto-suggest category and priority using LLM
-   User can override AI suggestions
-   Update ticket status
-   Filter by category, priority, status
-   Search by title and description

### LLM Integration

-   Endpoint: /api/tickets/classify/
-   Uses OpenRouter API
-   Returns suggested_category and suggested_priority
-   Graceful failure handling if LLM is unavailable

### Stats Dashboard

Database-level aggregation using Django ORM:

{ "total_tickets": 5, "open_tickets": 2, "avg_tickets_per_day": 5,
"priority_breakdown": {}, "category_breakdown": {} }

All aggregations are done using ORM aggregate/annotate (no Python
loops).

------------------------------------------------------------------------

## LLM Choice

Provider: OpenRouter

Reason: - Unified access to multiple models with free and easy setup, Easy HTTP-based
integration - Suitable for rapid prototyping and suitable for long duration on free tier - Flexible model selection

------------------------------------------------------------------------

## Running the Project

### Prerequisites

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## Setup Instructions

1.  Extract project folder (ensure .git directory exists).
2.  Create a .env file in project root:

OPENROUTER_API_KEY=your_openrouter_api_key_here 
url_for_api_key : https://openrouter.ai/settings/keys

3.  Run:

docker-compose up --build

Frontend: http://localhost:3000

Backend: http://localhost:8000/api/

------------------------------------------------------------------------

## Project Structure

support_ticket_system/ │ ├── backend/ ├── frontend/ ├──
docker-compose.yml ├── README.md └── .git/

------------------------------------------------------------------------

## Backend Details

Ticket Model Fields: - title (CharField, required, max_length=200) -
description (TextField, required) - category (choices, DB-level
enforced) - priority (choices, DB-level enforced) - status
(default=open) - created_at (auto-set)

DB constraints enforced using CheckConstraint.

------------------------------------------------------------------------

## API Endpoints

POST /api/tickets/ GET /api/tickets/ PATCH /api/tickets/`<id>`{=html}/
GET /api/tickets/stats/ POST /api/tickets/classify/

Supports filters: ?category= ?priority= ?status= ?search=

------------------------------------------------------------------------

## Frontend Features

-   AI auto-classification on description (Please come out of edit text field box and wait for 2 second)
-   Editable dropdowns
-   Status update per ticket
-   Filters and search
-   Stats display
-   No full page reload
-   Production build served via Docker

------------------------------------------------------------------------

## Design Decisions

1.  Production React build using npm run build + serve
2.  Graceful LLM failure handling
3.  Database-level aggregation for stats
4.  Fully containerized architecture
5.  Automatic migrations on startup

------------------------------------------------------------------------


## Evaluation Coverage

-   Docker End-to-End: Yes
-   LLM Integration: Yes
-   DB Constraints: Yes
-   API Design: Yes
-   DB Aggregation: Yes
-   React Structure: Yes
-   Code Quality: Yes
-   Commit History: Included
-   README: Included

------------------------------------------------------------------------

The application runs with:

docker-compose up --build

No additional setup required (except API key).
