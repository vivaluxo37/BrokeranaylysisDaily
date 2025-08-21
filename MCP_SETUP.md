# MCP Server Setup for Broker Analysis

## Supabase MCP Server Configuration

This project is configured to use the Supabase MCP (Model Context Protocol) server for enhanced AI assistance with database operations.

### Configuration Files

1. **`.env`** - Contains the Supabase access token
2. **`trae.config.json`** - Contains the MCP server configuration for Trae AI

### Setup Instructions

1. The Supabase MCP server is already configured in `trae.config.json`
2. The access token is stored in the `.env` file (excluded from version control)
3. Trae AI will automatically load this configuration when working with the project

### MCP Server Capabilities

The Supabase MCP server provides:
- Database schema inspection
- SQL query execution
- Table management
- Migration assistance
- Real-time data operations

### Security Notes

- The `.env` file is excluded from version control via `.gitignore`
- Never commit access tokens to the repository
- Rotate tokens regularly for security

### Usage

Once configured, you can ask Trae AI to:
- "Show me the database schema"
- "Create a new table for broker reviews"
- "Execute this SQL query"
- "Help me set up database migrations"

The MCP server will handle the communication with Supabase automatically.