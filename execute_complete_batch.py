import json

def read_complete_sql_file():
    """Read the complete batch SQL file"""
    try:
        with open('batch_insert_all_remaining_articles.sql', 'r', encoding='utf-8') as f:
            sql_content = f.read().strip()
        
        print(f"Successfully read SQL file: {len(sql_content)} characters")
        print(f"File contains {sql_content.count('VALUES')} INSERT statements")
        
        return sql_content
    except Exception as e:
        print(f"Error reading SQL file: {e}")
        return None

def prepare_mcp_data(sql_content):
    """Prepare the data for MCP execution"""
    mcp_data = {
        "server_name": "mcp.config.usrlocalmcp.supabase",
        "tool_name": "apply_migration",
        "args": {
            "project_id": "gngjezgilmdnjffxwquo",
            "name": "batch_insert_all_remaining_articles_complete",
            "query": sql_content
        }
    }
    
    # Save the MCP data to a file for reference
    with open('mcp_batch_data.json', 'w', encoding='utf-8') as f:
        json.dump(mcp_data, f, indent=2)
    
    print("MCP data prepared and saved to mcp_batch_data.json")
    print(f"Query length: {len(sql_content)} characters")
    
    return mcp_data

if __name__ == "__main__":
    print("Reading complete batch SQL file...")
    sql_content = read_complete_sql_file()
    
    if sql_content:
        print("Preparing MCP execution data...")
        mcp_data = prepare_mcp_data(sql_content)
        print("\nReady for MCP execution!")
        print("The SQL query is ready to be executed via MCP server.")
    else:
        print("Failed to read SQL file.")